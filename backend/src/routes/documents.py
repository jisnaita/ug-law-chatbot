from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Depends
from typing import List
import shutil
import os
import uuid
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..db.models import Document
from ..dependencies import doc_processor, embedding_service, vector_store

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

import logging
import traceback
import sys

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Create file handler
fh = logging.FileHandler('processing.log')
fh.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fh.setFormatter(formatter)
logger.addHandler(fh)

# Create console handler
ch = logging.StreamHandler(sys.stdout)
ch.setLevel(logging.INFO)
ch.setFormatter(formatter)
logger.addHandler(ch)

async def process_document_background(file_path: str, filename: str):
    print(f"DEBUG PRINT: Starting processing for {filename}", flush=True)
    logger.info(f"Starting processing for {filename}")
    try:
        # 1. Chunking
        logger.info(f"Chunking {filename}...")
        metadata = {"filename": filename, "source": filename} # Add more metadata as needed
        chunks = doc_processor.process_file(file_path, metadata)
        logger.info(f"Generated {len(chunks)} chunks for {filename}")
        
        # 2. Embedding
        logger.info(f"Embedding {len(chunks)} chunks...")
        texts = [chunk["text"] for chunk in chunks]
        embeddings = await embedding_service.embed_batch(texts)
        logger.info(f"Generated embeddings for {filename}")
        
        # 3. Add embeddings to chunks
        for i, chunk in enumerate(chunks):
            chunk["embedding"] = embeddings[i]
            
        # 4. Store in Vector DB
        logger.info(f"Storing chunks in Vector DB...")
        await vector_store.add_documents(chunks)
        
        logger.info(f"Successfully processed {filename}")
        
    except Exception as e:
        logger.error(f"Error processing {filename}: {e}")
        logger.error(traceback.format_exc())
    finally:
        # Cleanup
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Removed temporary file {file_path}")


@router.post("/upload")
async def upload_document(background_tasks: BackgroundTasks, file: UploadFile = File(...), db: Session = Depends(get_db)):
    doc_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{doc_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Save to DB
    db_doc = Document(id=doc_id, filename=file.filename, title=file.filename)
    db.add(db_doc)
    db.commit()
    db.refresh(db_doc)
        
    background_tasks.add_task(process_document_background, file_path, file.filename)
    
    return {"message": "File uploaded and processing started", "filename": file.filename, "id": doc_id}

@router.get("/documents")
def list_documents(db: Session = Depends(get_db)):
    return db.query(Document).all()

@router.get("/debug/qdrant")
async def debug_qdrant():
    try:
        collection_info = vector_store.client.get_collection(vector_store.collection_name)
        count = collection_info.points_count
        return {
            "collection_name": vector_store.collection_name,
            "points_count": count,
            "status": collection_info.status
        }
    except Exception as e:
        return {"error": str(e)}

