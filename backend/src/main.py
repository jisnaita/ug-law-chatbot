from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import documents, chat, retrieval
from .db.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Uganda Laws Chatbot API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(documents.router, prefix="/api/v1", tags=["documents"])
app.include_router(chat.router, prefix="/api/v1", tags=["chat"])
app.include_router(retrieval.router, prefix="/api/v1/retrieval", tags=["retrieval"])

@app.get("/")
def read_root():
    return {"message": "Uganda Laws Chatbot API is running (Modular)"}
