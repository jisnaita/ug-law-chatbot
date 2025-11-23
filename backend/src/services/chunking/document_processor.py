import hashlib
from typing import List, Dict, Any, Optional
from datetime import datetime
from docling.document_converter import DocumentConverter
from docling.datamodel.base_models import InputFormat
from docling.datamodel.document import InputDocument
from docling.chunking import HybridChunker

class DocumentProcessor:
    def __init__(self):
        self.converter = DocumentConverter()
        # Configure chunker: 500-1000 tokens (approx), 100 overlap
        # Docling's HybridChunker is good for structural segmentation
        self.chunker = HybridChunker(
            tokenizer="sentence-transformers/all-MiniLM-L6-v2", # Public tokenizer
            max_tokens=1000,
            merge_peers=True
        )

    def process_file(self, file_path: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Process a file and return a list of chunks with metadata.
        """
        # 1. Convert/Parse Document
        doc = self.converter.convert(file_path).document
        
        # 2. Chunking
        chunks = list(self.chunker.chunk(doc))
        
        processed_chunks = []
        
        for i, chunk in enumerate(chunks):
            chunk_text = chunk.text
            
            # Generate a unique ID for the chunk
            chunk_id = hashlib.sha256(f"{file_path}_{i}_{chunk_text}".encode()).hexdigest()
            
            # Extract section info if available (Docling provides structural context)
            section = "Unknown"
            if chunk.meta and chunk.meta.headings:
                section = " > ".join(chunk.meta.headings)
            
            processed_chunk = {
                "id": chunk_id,
                "source": metadata.get("source", "Unknown"),
                "section": section,
                "text": chunk_text,
                "chunk_index": i,
                "version": metadata.get("version", datetime.now().strftime("%Y-%m")),
                "effective_date": metadata.get("effective_date", None),
                "url": metadata.get("url", None),
                "filename": metadata.get("filename", file_path.split("/")[-1]),
                "token_count": len(chunk_text.split()) # Approximation, or use tokenizer
            }
            processed_chunks.append(processed_chunk)
            
        return processed_chunks

# Example usage
if __name__ == "__main__":
    processor = DocumentProcessor()
    # Test with a dummy file if needed
