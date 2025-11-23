from ...config import settings
from .interface import LLMProvider
from .openai_provider import OpenAILLM
from .gemini_provider import GeminiLLM

def get_llm_provider() -> LLMProvider:
    provider = settings.LLM_PROVIDER.lower()
    
    if provider == "openai":
        return OpenAILLM()
    elif provider == "gemini":
        return GeminiLLM()
    else:
        raise ValueError(f"Unknown LLM provider: {provider}")
