from typing import List
import openai
from .interface import EmbeddingProvider
from ...config import settings

class OpenAIEmbedding(EmbeddingProvider):
    def __init__(self):
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = "text-embedding-3-small"

    async def embed_text(self, text: str) -> List[float]:
        response = await self.client.embeddings.create(
            input=text,
            model=self.model
        )
        return response.data[0].embedding

    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        # OpenAI has a limit on batch size, but for simplicity we'll assume it fits or caller handles batching
        response = await self.client.embeddings.create(
            input=texts,
            model=self.model
        )
        return [data.embedding for data in response.data]
