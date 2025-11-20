import time
import random

class MockRAGEngine:
    def __init__(self):
        pass

    def ingest(self, file_content):
        # Simulate processing time
        time.sleep(1.5)
        return True

    def generate_title(self, filename):
        # Simulate LLM title generation
        titles = [
            f"Analysis of {filename}",
            f"Summary: {filename.split('.')[0].replace('_', ' ')}",
            "Uganda Business Law Overview",
            "Tax Compliance Guidelines 2024",
            "NSSF Contributions Amendment"
        ]
        return random.choice(titles)

    def query(self, text):
        # Simulate RAG response
        time.sleep(1)
        return {
            "answer": f"Based on the documents, here is some information regarding '{text}'. The laws state that businesses must register for TIN and file returns by the due date. Failure to comply results in penalties.",
            "citations": [
                {"source": "Uganda Income Tax Act.pdf", "page": 12},
                {"source": "NSSF Act 2022.pdf", "page": 5}
            ]
        }

mock_rag = MockRAGEngine()
