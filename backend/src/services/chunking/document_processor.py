import hashlib
from typing import List, Dict, Any, Optional
from datetime import datetime
from pypdf import PdfReader
import os

class DocumentProcessor:
    def __init__(self):
        self.chunk_size = 1000  # Characters
        self.chunk_overlap = 200

    def process_file(self, file_path: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Process a file and return a list of chunks with metadata.
        Supports PDF and TXT.
        """
        text = ""
        if file_path.lower().endswith('.pdf'):
            try:
                reader = PdfReader(file_path)
                for page in reader.pages:
                    text += page.extract_text() + "\n"
            except Exception as e:
                print(f"Error reading PDF {file_path}: {e}")
                raise
        elif file_path.lower().endswith('.txt'):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    text = f.read()
            except Exception as e:
                print(f"Error reading TXT {file_path}: {e}")
                raise
        else:
            raise ValueError(f"Unsupported file format: {file_path}")

        # Simple sliding window chunking
        chunks = []
        start = 0
        text_len = len(text)

        while start < text_len:
            end = start + self.chunk_size
            chunk_text = text[start:end]
            
            # Generate a unique ID for the chunk
            chunk_id = hashlib.sha256(f"{file_path}_{start}_{chunk_text}".encode()).hexdigest()
            
            processed_chunk = {
                "id": chunk_id,
                "source": metadata.get("source", "Unknown"),
                "section": "Unknown", # Simplified
                "text": chunk_text,
                "chunk_index": len(chunks),
                "version": metadata.get("version", datetime.now().strftime("%Y-%m")),
                "effective_date": metadata.get("effective_date", None),
                "url": metadata.get("url", None),
                "filename": metadata.get("filename", file_path.split("/")[-1]),
                "token_count": len(chunk_text.split()) # Approximation
            }
            chunks.append(processed_chunk)
            
            start += self.chunk_size - self.chunk_overlap
            
        return chunks

# Example usage
if __name__ == "__main__":
    processor = DocumentProcessor()

