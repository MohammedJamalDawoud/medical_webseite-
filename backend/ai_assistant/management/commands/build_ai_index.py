"""
Django management command to build the AI assistant documentation index.

Usage:
    python manage.py build_ai_index

This command:
1. Collects all markdown documentation files from the project
2. Splits them into chunks
3. Generates embeddings using sentence-transformers
4. Builds a FAISS vector index for fast similarity search
5. Saves the index to disk (ai_index/ directory)

Note: This is for documentation and research workflow support only.
NOT for clinical diagnosis or patient treatment decisions.
"""

from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from pathlib import Path

class Command(BaseCommand):
    help = 'Build the AI assistant documentation index from project markdown files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force rebuild even if index already exists',
        )

    def handle(self, *args, **options):
        # Check if AI assistant is enabled
        if not getattr(settings, 'AI_ASSISTANT_ENABLED', False):
            raise CommandError(
                'AI Assistant is disabled. '
                'Set AI_ASSISTANT_ENABLED=True in settings or environment.'
            )

        self.stdout.write('Building AI Assistant Documentation Index...')
        self.stdout.write('=' * 60)

        # Import here to provide helpful error message if dependencies missing
        try:
            from ai_assistant.indexer import DocumentIndexer, DEPENDENCIES_AVAILABLE
            
            if not DEPENDENCIES_AVAILABLE:
                raise CommandError(
                    'AI Assistant dependencies not installed.\n'
                    'Install with: pip install sentence-transformers faiss-cpu'
                )
        except ImportError as e:
            raise CommandError(f'Failed to import indexer: {e}')

        # Get paths from settings
        index_path = Path(settings.AI_VECTOR_INDEX_PATH)
        base_dir = settings.BASE_DIR

        # Check if index already exists
        if index_path.exists() and not options['force']:
            self.stdout.write(
                self.style.WARNING(
                    f'\nIndex already exists at: {index_path}\n'
                    'Use --force to rebuild.'
                )
            )
            return

        try:
            # Create indexer
            self.stdout.write('\nInitializing indexer...')
            indexer = DocumentIndexer()

            # Build index
            self.stdout.write(f'\nSearching for documentation in: {base_dir}')
            num_files, num_chunks = indexer.build_index(base_dir)

            if num_chunks == 0:
                self.stdout.write(
                    self.style.WARNING(
                        '\nNo documentation found or indexed.\n'
                        'Make sure you have .md files in your project root or docs/ directory.'
                    )
                )
                return

            # Save index
            self.stdout.write(f'\nSaving index to: {index_path}')
            indexer.save_index(index_path)

            # Success message
            self.stdout.write('\n' + '=' * 60)
            self.stdout.write(
                self.style.SUCCESS(
                    f'\nSuccessfully built documentation index:\n'
                    f'  - Files processed: {num_files}\n'
                    f'  - Chunks created: {num_chunks}\n'
                    f'  - Index location: {index_path}\n'
                )
            )
            self.stdout.write(
                '\nThe AI assistant is now ready to answer documentation questions!'
            )
            self.stdout.write(
                self.style.WARNING(
                    '\nReminder: This is for documentation/research support only.\n'
                    'NOT for clinical diagnosis or patient treatment.'
                )
            )

        except Exception as e:
            raise CommandError(f'Failed to build index: {e}')
