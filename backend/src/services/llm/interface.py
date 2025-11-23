from abc import ABC, abstractmethod
from typing import List, Dict, Any

class LLMProvider(ABC):
    @abstractmethod
    async def generate_answer(self, question: str, context_chunks: List[Dict[str, Any]]) -> str:
        """Generate an answer based on the question and context chunks."""
        pass
