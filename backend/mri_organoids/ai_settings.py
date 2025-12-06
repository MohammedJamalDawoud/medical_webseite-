# AI Assistant Configuration (Optional - for RAG-based documentation Q&A)
AI_ASSISTANT_ENABLED = os.getenv('AI_ASSISTANT_ENABLED', 'True').lower() == 'true'
AI_VECTOR_INDEX_PATH = BASE_DIR / 'ai_index'
AI_LLM_PROVIDER = os.getenv('AI_LLM_PROVIDER', None)  # 'openai' or None
AI_LLM_API_KEY = os.getenv('AI_LLM_API_KEY', None)
AI_LLM_MODEL = os.getenv('AI_LLM_MODEL', 'gpt-4')
