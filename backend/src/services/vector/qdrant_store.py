from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient
from qdrant_client.http import models
from .interface import VectorStore
from ...config import settings
import uuid

class QdrantStore(VectorStore):
    def __init__(self):
        if settings.VECTOR_DB_URL and settings.VECTOR_DB_URL.startswith("http"):
            self.client = QdrantClient(url=settings.VECTOR_DB_URL, api_key=settings.VECTOR_DB_API_KEY)
        elif settings.VECTOR_DB_URL == ":memory:":
            self.client = QdrantClient(location=":memory:")
        else:
            self.client = QdrantClient(path=settings.VECTOR_DB_URL)
        self.collection_name = "uganda_laws"
        self.vector_size = 1536 # OpenAI text-embedding-3-small dimension

        # Ensure collection exists
        self._ensure_collection()

    def _ensure_collection(self):
        collections = self.client.get_collections()
        if not any(c.name == self.collection_name for c in collections.collections):
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(size=self.vector_size, distance=models.Distance.COSINE)
            )

    async def add_documents(self, documents: List[Dict[str, Any]]) -> bool:
        points = []
        for doc in documents:
            # Expecting 'embedding' to be present in the document dict or passed separately
            # In this architecture, the caller should have already embedded the text
            if "embedding" not in doc:
                raise ValueError("Document must contain 'embedding' field")
            
            vector = doc.pop("embedding")
            payload = doc
            
            points.append(models.PointStruct(
                id=str(uuid.uuid4()), # Or use doc['id'] if it's a valid UUID
                vector=vector,
                payload=payload
            ))
            
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        return True

    async def search(self, query_vector: List[float], limit: int = 5, filters: Optional[Dict] = None) -> List[Dict[str, Any]]:
        # Use query_points for v1.10+ compatibility
        search_result = self.client.query_points(
            collection_name=self.collection_name,
            query=query_vector,
            limit=limit
        ).points
        
        results = []
        for hit in search_result:
            doc = hit.payload
            doc['score'] = hit.score
            results.append(doc)
            
        return results

    async def delete_document(self, document_id: str) -> bool:
        # This might need to delete by payload filter if ID is not the point ID
        # For now assuming we delete by point ID, but we might need to delete by 'source' or 'filename'
        # Let's implement delete by filter for flexibility
        self.client.delete(
            collection_name=self.collection_name,
            points_selector=models.FilterSelector(
                filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="id",
                            match=models.MatchValue(value=document_id)
                        )
                    ]
                )
            )
        )
        return True
