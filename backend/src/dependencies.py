from .services.chunking.document_processor import DocumentProcessor
from .services.embedding.openai_provider import OpenAIEmbedding
from .services.vector.qdrant_store import QdrantStore

# Initialize services once (Singleton pattern)
doc_processor = DocumentProcessor()
embedding_service = OpenAIEmbedding()
vector_store = QdrantStore()
