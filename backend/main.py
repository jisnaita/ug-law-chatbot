from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import hashlib
from database import init_db, add_document, get_documents, get_document_by_hash
from mock_rag_engine import mock_rag

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB
init_db()

class ChatRequest(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {"message": "Uganda Laws Chatbot API is running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()
    file_hash = hashlib.sha256(content).hexdigest()
    
    # Check for duplicates
    existing_doc = get_document_by_hash(file_hash)
    if existing_doc:
        return {"message": "File already exists", "document": existing_doc}
    
    # Mock Ingestion
    mock_rag.ingest(content)
    
    # Mock Title Generation
    title = mock_rag.generate_title(file.filename)
    
    # Save to DB
    doc_id = add_document(file.filename, file_hash, title)
    
    return {
        "message": "File uploaded successfully",
        "document": {
            "id": doc_id,
            "filename": file.filename,
            "title": title
        }
    }

@app.get("/documents")
def list_documents():
    return get_documents()

@app.post("/chat")
def chat(request: ChatRequest):
    response = mock_rag.query(request.query)
    return response
