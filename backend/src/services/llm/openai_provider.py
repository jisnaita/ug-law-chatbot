from typing import List, Dict, Any
import openai
from .interface import LLMProvider
from ...config import settings

class OpenAILLM(LLMProvider):
    def __init__(self):
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = "gpt-4o-mini" # Or gpt-4o, configurable

    async def generate_answer(self, question: str, context_chunks: List[Dict[str, Any]]) -> str:
        # Construct context string
        context_text = "\n\n".join([
            f"Source: {chunk.get('source', 'Unknown')}\nContent: {chunk.get('text', '')}"
            for chunk in context_chunks
        ])
        
        system_prompt = """You are a legal assistant for Uganda laws. 
Answer the user's question based ONLY on the provided context. 
Cite the source for every claim. 
If the answer is not in the context, say you don't know."""

        user_prompt = f"""Context:
{context_text}

Question: {question}
"""

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0
        )
        
        return response.choices[0].message.content
