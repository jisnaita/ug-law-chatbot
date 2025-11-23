from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..db.models import Chat, Message, User
from ..services.llm.factory import get_llm_provider
from ..dependencies import embedding_service, vector_store
import uuid

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    chat_id: Optional[str] = None
    user_id: str # For now, passed directly. In real app, get from auth token.

class ChatResponse(BaseModel):
    response: str
    chat_id: str
    citations: List[str]

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    # 1. Get or Create Chat
    if request.chat_id:
        chat_obj = db.query(Chat).filter(Chat.id == request.chat_id).first()
        if not chat_obj:
            raise HTTPException(status_code=404, detail="Chat not found")
    else:
        # Create new chat
        chat_id = str(uuid.uuid4())
        chat_obj = Chat(id=chat_id, user_id=request.user_id, title=request.message[:50])
        db.add(chat_obj)
        db.commit()
        db.refresh(chat_obj)

    # 2. Save User Message
    user_msg = Message(chat_id=chat_obj.id, role="user", content=request.message)
    db.add(user_msg)
    db.commit()

    # 3. Retrieve Context
    query_embedding = await embedding_service.embed_text(request.message)
    context_chunks = await vector_store.search(query_embedding, limit=5)

    # 4. Generate Answer
    llm = get_llm_provider()
    answer = await llm.generate_answer(request.message, context_chunks)

    # 5. Save Assistant Message
    assistant_msg = Message(chat_id=chat_obj.id, role="assistant", content=answer)
    db.add(assistant_msg)
    db.commit()
    
    # Extract citations (simple approach)
    citations = list(set([chunk.get('source', 'Unknown') for chunk in context_chunks]))

    return ChatResponse(
        response=answer,
        chat_id=chat_obj.id,
        citations=citations
    )
