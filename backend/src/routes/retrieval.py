from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from ..dependencies import embedding_service, vector_store

router = APIRouter()

class RetrievalRequest(BaseModel):
    query: str = Field(..., description="The user's question or query to search for.")
    limit: int = Field(default=5, ge=1, le=20, description="Number of chunks to retrieve.")

class RetrievalResult(BaseModel):
    text: str
    source: str
    score: float
    page: Optional[int] = 1
    metadata: Optional[Dict[str, Any]] = None

class RetrievalResponse(BaseModel):
    results: List[RetrievalResult]

import logging

logger = logging.getLogger(__name__)

@router.post("/search", response_model=RetrievalResponse, summary="Search Knowledge Base")
async def search_knowledge_base(request: RetrievalRequest):
    """
    Search the vector database for relevant document chunks based on the query.
    This endpoint is designed to be used by a Custom GPT.
    """
    print(f"DEBUG: Received retrieval request: {request.query}", flush=True)
    try:
        # 1. Generate Embedding
        query_embedding = await embedding_service.embed_text(request.query)
        
        # 2. Search Vector DB
        # We might need to adjust the search method in vector_store if it doesn't support returning scores directly in the format we want,
        # but based on previous analysis, it returns a list of dicts.
        search_results = await vector_store.search(query_embedding, limit=request.limit)
        
        # 3. Format Results
        formatted_results = []
        for res in search_results:
            formatted_results.append(RetrievalResult(
                text=res.get("text", ""),
                source=res.get("source", "Unknown"),
                score=res.get("score", 0.0),
                page=res.get("page", 1),
                metadata={k:v for k,v in res.items() if k not in ["text", "source", "score", "page", "embedding"]}
            ))
            
        return RetrievalResponse(results=formatted_results)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
