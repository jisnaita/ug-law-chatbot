from pydantic_settings import BaseSettings
from typing import Optional
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseSettings):
    # API Keys
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None

    # Services
    LLM_PROVIDER: str = "openai"  # openai, gemini, anthropic
    EMBEDDING_PROVIDER: str = "openai"
    
    # Vector DB
    VECTOR_DB_URL: str = "http://localhost:6333" # Qdrant default
    VECTOR_DB_API_KEY: Optional[str] = None
    
    # Database
    DATABASE_URL: str = "sqlite:///./documents.db"

    class Config:
        env_file = ".env"

settings = Settings()
