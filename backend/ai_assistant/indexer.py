"""
Document indexer for RAG-based documentation Q&A.

This module handles:
- Collecting markdown documentation files
- Splitting documents into chunks
- Generating embeddings using sentence-transformers
- Building and persisting a FAISS vector index

NOTE: This is for documentation and research workflow support only.
NOT for clinical diagnosis or patient treatment decisions.
"""

import os
import json
import re
from pathlib import Path
from typing import List, Dict, Tuple
from dataclasses import dataclass, asdict

try:
    from sentence_transformers import SentenceTransformer
    import faiss
    import numpy as np
    DEPENDENCIES_AVAILABLE = True
except ImportError:
    DEPENDENCIES_AVAILABLE = False


@dataclass
class DocChunk:
    """Represents a chunk of documentation with metadata."""
    text: str
    filename: str
    heading: str
    line_start: int
    line_end: int
    chunk_index: int


class DocumentIndexer:
    """
    Builds and maintains a vector index over project documentation.
    
    Uses sentence-transformers for embeddings and FAISS for efficient
    nearest-neighbor search.
    """
    
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        """
        Initialize the indexer.
        
        Args:
            model_name: Name of the sentence-transformers model to use.
                       Default is a small, fast model suitable for documentation.
        """
        if not DEPENDENCIES_AVAILABLE:
            raise ImportError(
                "AI Assistant dependencies not installed. "
                "Install with: pip install sentence-transformers faiss-cpu"
            )
        
        self.model_name = model_name
        self.model = SentenceTransformer(model_name)
        self.index = None
        self.chunks = []
    
    def collect_documentation_files(self, base_dir: Path) -> List[Path]:
        """
        Collect all markdown documentation files from the project.
        
        Args:
            base_dir: Base directory of the project
            
        Returns:
            List of Path objects for markdown files
        """
        doc_files = []
        
        # Look for documentation files in common locations
        search_patterns = [
            'COMPLETE_PROJECT_DOCUMENTATION.md',
            'PROJECT_README.md',
            'API_DOCS.md',
            'README.md',
            '*.md',  # Any markdown file in root
        ]
        
        # Search in root directory
        for pattern in search_patterns:
            for file in base_dir.glob(pattern):
                if file.is_file() and file not in doc_files:
                    doc_files.append(file)
        
        # Search in docs/ directory if it exists
        docs_dir = base_dir / 'docs'
        if docs_dir.exists():
            for file in docs_dir.rglob('*.md'):
                if file.is_file() and file not in doc_files:
                    doc_files.append(file)
        
        return doc_files
    
    def extract_heading_from_line(self, line: str) -> str:
        """Extract heading text from a markdown heading line."""
        # Remove markdown heading markers (#, ##, etc.)
        heading = re.sub(r'^#+\s*', '', line.strip())
        return heading if heading else "Document"
    
    def split_document_into_chunks(
        self, 
        file_path: Path, 
        chunk_size: int = 500, 
        overlap: int = 50
    ) -> List[DocChunk]:
        """
        Split a markdown document into overlapping chunks.
        
        Args:
            file_path: Path to the markdown file
            chunk_size: Target size for each chunk (characters)
            overlap: Number of characters to overlap between chunks
            
        Returns:
            List of DocChunk objects
        """
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Warning: Could not read {file_path}: {e}")
            return []
        
        lines = content.split('\n')
        chunks = []
        current_chunk_text = ""
        current_heading = "Introduction"
        chunk_start_line = 0
        chunk_index = 0
        
        for i, line in enumerate(lines):
            # Update heading if we encounter one
            if line.strip().startswith('#'):
                current_heading = self.extract_heading_from_line(line)
            
            current_chunk_text += line + '\n'
            
            # Create a chunk when we reach the target size
            if len(current_chunk_text) >= chunk_size:
                chunks.append(DocChunk(
                    text=current_chunk_text.strip(),
                    filename=file_path.name,
                    heading=current_heading,
                    line_start=chunk_start_line + 1,  # 1-indexed
                    line_end=i + 1,  # 1-indexed
                    chunk_index=chunk_index
                ))
                
                # Set overlap for next chunk
                overlap_text = current_chunk_text[-overlap:] if len(current_chunk_text) > overlap else ""
                current_chunk_text = overlap_text
                chunk_start_line = i - (overlap // 20)  # Approximate line count for overlap
                chunk_index += 1
        
        # Add remaining text as final chunk
        if current_chunk_text.strip():
            chunks.append(DocChunk(
                text=current_chunk_text.strip(),
                filename=file_path.name,
                heading=current_heading,
                line_start=chunk_start_line + 1,
                line_end=len(lines),
                chunk_index=chunk_index
            ))
        
        return chunks
    
    def build_index(self, base_dir: Path) -> Tuple[int, int]:
        """
        Build the complete vector index from all documentation.
        
        Args:
            base_dir: Base directory of the project
            
        Returns:
            Tuple of (number of files processed, number of chunks created)
        """
        print("Collecting documentation files...")
        doc_files = self.collect_documentation_files(base_dir)
        print(f"Found {len(doc_files)} documentation files")
        
        print("Splitting documents into chunks...")
        all_chunks = []
        for file_path in doc_files:
            chunks = self.split_document_into_chunks(file_path)
            all_chunks.extend(chunks)
        
        print(f"Created {len(all_chunks)} chunks")
        
        if not all_chunks:
            print("Warning: No chunks created. No documentation to index.")
            return 0, 0
        
        print("Generating embeddings...")
        texts = [chunk.text for chunk in all_chunks]
        embeddings = self.model.encode(texts, show_progress_bar=True, convert_to_numpy=True)
        
        print("Building FAISS index...")
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)  # L2 distance index
        self.index.add(embeddings.astype('float32'))
        
        self.chunks = all_chunks
        
        print(f"Index built successfully: {len(all_chunks)} chunks indexed")
        return len(doc_files), len(all_chunks)
    
    def save_index(self, index_path: Path):
        """
        Save the index and metadata to disk.
        
        Args:
            index_path: Directory where index files will be saved
        """
        if self.index is None:
            raise ValueError("No index to save. Build the index first.")
        
        index_path.mkdir(parents=True, exist_ok=True)
        
        # Save FAISS index
        faiss.write_index(self.index, str(index_path / 'index.faiss'))
        
        # Save chunk metadata
        metadata = [asdict(chunk) for chunk in self.chunks]
        with open(index_path / 'metadata.json', 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2)
        
        # Save configuration
        config = {
            'model_name': self.model_name,
            'num_chunks': len(self.chunks),
            'embedding_dimension': self.index.d
        }
        with open(index_path / 'config.json', 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2)
        
        print(f"Index saved to {index_path}")
    
    def load_index(self, index_path: Path):
        """
        Load a previously saved index from disk.
        
        Args:
            index_path: Directory where index files are stored
        """
        if not index_path.exists():
            raise FileNotFoundError(f"Index directory not found: {index_path}")
        
        # Load configuration
        with open(index_path / 'config.json', 'r') as f:
            config = json.load(f)
        
        # Verify model matches
        if config['model_name'] != self.model_name:
            print(f"Warning: Index was built with {config['model_name']}, "
                  f"but loading with {self.model_name}")
        
        # Load FAISS index
        self.index = faiss.read_index(str(index_path / 'index.faiss'))
        
        # Load chunk metadata
        with open(index_path / 'metadata.json', 'r') as f:
            metadata = json.load(f)
            self.chunks = [DocChunk(**chunk_data) for chunk_data in metadata]
        
        print(f"Index loaded: {len(self.chunks)} chunks")
    
    def search(self, query: str, top_k: int = 5) -> List[Tuple[DocChunk, float]]:
        """
        Search the index for relevant documentation chunks.
        
        Args:
            query: Natural language query
            top_k: Number of results to return
            
        Returns:
            List of (DocChunk, similarity_score) tuples, ordered by relevance
        """
        if self.index is None:
            raise ValueError("No index loaded. Build or load an index first.")
        
        # Generate query embedding
        query_embedding = self.model.encode([query], convert_to_numpy=True)
        
        # Search index
        distances, indices = self.index.search(query_embedding.astype('float32'), top_k)
        
        # Convert distances to similarity scores (lower distance = higher similarity)
        # Using negative distance as score (closer to 0 is better)
        results = []
        for idx, distance in zip(indices[0], distances[0]):
            if idx < len(self.chunks):  # Verify index is valid
                similarity = float(1.0 / (1.0 + distance))  # Convert distance to 0-1 similarity
                results.append((self.chunks[idx], similarity))
        
        return results
