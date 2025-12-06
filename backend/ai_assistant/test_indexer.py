"""
Tests for the AI Assistant indexer and search functionality.
"""

import tempfile
import shutil
from pathlib import Path
from django.test import TestCase
from django.conf import settings

try:
    from ai_assistant.indexer import DocumentIndexer, DEPENDENCIES_AVAILABLE
    AI_AVAILABLE = DEPENDENCIES_AVAILABLE
except ImportError:
    AI_AVAILABLE = False


class AIIndexerTestCase(TestCase):
    """Test cases for DocumentIndexer."""
    
    def setUp(self):
        """Set up temporary directory with test documents."""
        if not AI_AVAILABLE:
            self.skipTest("AI dependencies not available")
        
        # Create temporary directory
        self.temp_dir = Path(tempfile.mkdtemp())
        
        # Create test markdown files
        (self.temp_dir / "README.md").write_text("""
# Test Project

This is a test project for AI assistant.

## Features
- Feature 1: Data management
- Feature 2: Pipeline execution
- Feature 3: Results visualization

## Installation
Run `pip install -r requirements.txt` to install dependencies.
        """)
        
        (self.temp_dir / "API_DOCS.md").write_text("""
# API Documentation

## Endpoints

### GET /api/organoids/
Returns list of all organoids.

### POST /api/organoids/
Creates a new organoid.

Required fields:
- organoid_id: Unique identifier
- species: HUMAN or MARMOSET
        """)
        
        self.indexer = DocumentIndexer()
    
    def tearDown(self):
        """Clean up temporary directory."""
        if hasattr(self, 'temp_dir') and self.temp_dir.exists():
            shutil.rmtree(self.temp_dir)
    
    def test_collect_documentation_files(self):
        """Test that markdown files are collected correctly."""
        if not AI_AVAILABLE:
            self.skipTest("AI dependencies not available")
        
        files = self.indexer.collect_documentation_files(self.temp_dir)
        self.assertEqual(len(files), 2)
        file_names = [f.name for f in files]
        self.assertIn("README.md", file_names)
        self.assertIn("API_DOCS.md", file_names)
    
    def test_split_document_into_chunks(self):
        """Test document chunking."""
        if not AI_AVAILABLE:
            self.skipTest("AI dependencies not available")
        
        test_file = self.temp_dir / "README.md"
        chunks = self.indexer.split_document_into_chunks(test_file, chunk_size=100, overlap=20)
        
        self.assertGreater(len(chunks), 0)
        # Verify chunks have required attributes
        for chunk in chunks:
            self.assertIsNotNone(chunk.text)
            self.assertIsNotNone(chunk.filename)
            self.assertIsNotNone(chunk.heading)
            self.assertGreater(chunk.line_end, chunk.line_start)
    
    def test_build_and_search_index(self):
        """Test building index and searching."""
        if not AI_AVAILABLE:
            self.skipTest("AI dependencies not available")
        
        # Build index
        num_files, num_chunks = self.indexer.build_index(self.temp_dir)
        self.assertEqual(num_files, 2)
        self.assertGreater(num_chunks, 0)
        
        # Test search
        results = self.indexer.search("How do I install dependencies?", top_k=3)
        self.assertGreater(len(results), 0)
        
        # Verify result structure
        chunk, score = results[0]
        self.assertIsNotNone(chunk.text)
        self.assertGreater(score, 0.0)
        self.assertLessEqual(score, 1.0)
        
        # Verify relevant result  (installation query should match installation section)
        self.assertIn("install", chunk.text.lower())
    
    def test_save_and_load_index(self):
        """Test saving and loading index."""
        if not AI_AVAILABLE:
            self.skipTest("AI dependencies not available")
        
        # Build index
        self.indexer.build_index(self.temp_dir)
        
        # Save index
        index_path = self.temp_dir / "test_index"
        self.indexer.save_index(index_path)
        
        # Verify files were created
        self.assertTrue((index_path / "index.faiss").exists())
        self.assertTrue((index_path / "metadata.json").exists())
        self.assertTrue((index_path / "config.json").exists())
        
        # Load index in new indexer
        new_indexer = DocumentIndexer()
        new_indexer.load_index(index_path)
        
        # Verify loaded index works
        results = new_indexer.search("API endpoints", top_k=2)
        self.assertGreater(len(results), 0)
        
        # Results should mention API
        chunk, score = results[0]
        self.assertIn("api", chunk.text.lower())
    
    def test_search_returns_top_k_results(self):
        """Test that search returns requested number of results."""
        if not AI_AVAILABLE:
            self.skipTest("AI dependencies not available")
        
        self.indexer.build_index(self.temp_dir)
        
        # Request 1 result
        results_1 = self.indexer.search("test query", top_k=1)
        self.assertEqual(len(results_1), 1)
        
        # Request 3 results
        results_3 = self.indexer.search("test query", top_k=3)
        self.assertLessEqual(len(results_3), 3)  # May be fewer if not enough chunks
