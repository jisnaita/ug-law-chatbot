from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class VectorStore(ABC):
    @abstractmethod
    async def add_documents(self, documents: List[Dict[str, Any]]) -> bool:
        """Add documents (chunks) to the vector store."""
        pass

    @abstractmethod
    async def search(self, query_vector: List[float], limit: int = 5, filters: Optional[Dict] = None) -> List[Dict[str, Any]]:
        """Search for similar documents."""
        pass
    
    @abstractmethod
    async def delete_document(self, document_id: str) -> bool:
        """Delete a document by ID."""
        pass
