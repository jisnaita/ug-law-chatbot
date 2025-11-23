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

async def process_document_background(file_path: str, filename: str):
    try:
        # 1. Chunking
        metadata = {"filename": filename, "source": filename} # Add more metadata as needed
        chunks = doc_processor.process_file(file_path, metadata)
        
        # 2. Embedding
        texts = [chunk["text"] for chunk in chunks]
        embeddings = await embedding_service.embed_batch(texts)
        
        # 3. Add embeddings to chunks
        for i, chunk in enumerate(chunks):
            chunk["embedding"] = embeddings[i]
            
        # 4. Store in Vector DB
        await vector_store.add_documents(chunks)
        
        print(f"Successfully processed {filename}")
        
    except Exception as e:
        print(f"Error processing {filename}: {e}")
    finally:
        # Cleanup
        if os.path.exists(file_path):
            os.remove(file_path)

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
