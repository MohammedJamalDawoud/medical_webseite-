"""
Views for AI Assistant API endpoints.

Provides RAG-based documentation Q&A functionality.
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from pathlib import Path


@api_view(['POST'])
@permission_classes([AllowAny])  # TODO: Change to IsAuthenticated for production
def ask_docs(request):
    """
    Answer questions about project documentation using RAG.
    
    POST /api/ai/ask-docs/
    Request: { "question": "<string>" }
    
    Response:
    {
        "answer": null or "<string>",  # Null if no LLM configured
        "chunks": [
            {
                "text": "...",
                "filename": "...",
                "heading": "...",
                "line_start": int,
                "line_end": int,
                "score": float
            },
            ...
        ],
        "note": "..." # If no LLM configured
    }
    
    NOTE: This is for documentation and research workflow support only.
    NOT for clinical diagnosis or patient treatment decisions.
    """
    # Check if AI assistant is enabled
    if not getattr(settings, 'AI_ASSISTANT_ENABLED', False):
        return Response(
            {'error': 'AI Assistant is disabled'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    # Validate request
    question = request.data.get('question')
    if not question:
        return Response(
            {'error': 'Missing required field: question'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if dependencies are available
    try:
        from ai_assistant.indexer import DocumentIndexer, DEPENDENCIES_AVAILABLE
        
        if not DEPENDENCIES_AVAILABLE:
            return Response(
                {
                    'error': 'AI Assistant dependencies not installed',
                    'note': 'Install with: pip install sentence-transformers faiss-cpu'
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
    except ImportError as e:
        return Response(
            {'error': f'Failed to load AI assistant: {str(e)}'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    # Load index
    index_path = Path(settings.AI_VECTOR_INDEX_PATH)
    if not index_path.exists():
        return Response(
            {
                'error': 'Documentation index not found',
                'note': 'Run: python manage.py build_ai_index'
            },
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        # Create indexer and load existing index
        indexer = DocumentIndexer()
        indexer.load_index(index_path)
        
        # Search for relevant chunks
        top_k = request.data.get('top_k', 5)
        results = indexer.search(question, top_k=top_k)
        
        # Format results
        chunks = [
            {
                'text': chunk.text,
                'filename': chunk.filename,
                'heading': chunk.heading,
                'line_start': chunk.line_start,
                'line_end': chunk.line_end,
                'score': round(score, 3)
            }
            for chunk, score in results
        ]
        
        # Check if LLM is configured (for future use)
        llm_configured = (
            getattr(settings, 'AI_LLM_PROVIDER', None) is not None and
            getattr(settings, 'AI_LLM_API_KEY', None) is not None
        )
        
        response_data = {
            'answer': None,  # No LLM in this minimal implementation
            'chunks': chunks,
            'note': (
                'Showing relevant documentation snippets. '
                'LLM-generated answers not configured in this version.'
            ) if not llm_configured else None
        }
        
        # TODO: Future enhancement - use LLM to generate answer from chunks
        # if llm_configured:
        #     response_data['answer'] = generate_llm_answer(question, chunks)
        #     response_data['note'] = None
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': f'Search failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
