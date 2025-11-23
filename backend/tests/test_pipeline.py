import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from src.services.chunking.document_processor import DocumentProcessor
from src.services.embedding.openai_provider import OpenAIEmbedding
from src.services.vector.qdrant_store import QdrantStore

async def test_pipeline():
    print("Initializing services...")
    
    # Patch settings for testing
    from src.config import settings
    settings.VECTOR_DB_URL = ":memory:"
    settings.VECTOR_DB_API_KEY = None

    doc_processor = DocumentProcessor()
    embedding_service = OpenAIEmbedding()
    vector_store = QdrantStore()

    # Create a dummy file
    filename = "test_doc.md"
    with open(filename, "w") as f:
        f.write("# Introduction\nThis is a test document for the Uganda Laws Chatbot.\n\n# Section 1\nIt has multiple sections to test chunking.")

    try:
        print("1. Processing Document...")
        metadata = {"filename": filename, "source": "Test Source"}
        chunks = doc_processor.process_file(filename, metadata)
        print(f"   Generated {len(chunks)} chunks.")
        print(f"   Sample chunk: {chunks[0]['text']}")

        print("2. Embedding Chunks...")
        texts = [chunk["text"] for chunk in chunks]
        # Mock embedding if no API key
        if not os.getenv("OPENAI_API_KEY"):
            print("   WARNING: No OPENAI_API_KEY found. Using mock embeddings.")
            embeddings = [[0.1] * 1536 for _ in texts]
        else:
            embeddings = await embedding_service.embed_batch(texts)
        print("   Embeddings generated.")

        print("3. Storing in Vector DB...")
        for i, chunk in enumerate(chunks):
            chunk["embedding"] = embeddings[i]
        
        await vector_store.add_documents(chunks)
        print("   Stored in Qdrant.")

        print("4. Searching...")
        query = "test document"
        if not os.getenv("OPENAI_API_KEY"):
            query_vec = [0.1] * 1536
        else:
            query_vec = await embedding_service.embed_text(query)
            
        results = await vector_store.search(query_vec, limit=1)
        print(f"   Found {len(results)} results.")
        print(f"   Top result: {results[0]['text']}")

    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        if os.path.exists(filename):
            os.remove(filename)

if __name__ == "__main__":
    asyncio.run(test_pipeline())
