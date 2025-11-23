from typing import List, Dict, Any
import google.generativeai as genai
from .interface import LLMProvider
from ...config import settings

class GeminiLLM(LLMProvider):
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def generate_answer(self, question: str, context_chunks: List[Dict[str, Any]]) -> str:
        context_text = "\n\n".join([
            f"Source: {chunk.get('source', 'Unknown')}\nContent: {chunk.get('text', '')}"
            for chunk in context_chunks
        ])
        
        prompt = f"""You are a legal assistant for Uganda laws. 
Answer the user's question based ONLY on the provided context. 
Cite the source for every claim. 
If the answer is not in the context, say you don't know.

Context:
{context_text}

Question: {question}
"""
        
        response = await self.model.generate_content_async(prompt)
        return response.text
