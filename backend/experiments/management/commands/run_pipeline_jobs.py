"""
Management command to process pending pipeline runs.

This command can be run via:
- Docker CLI: docker compose run backend python manage.py run_pipeline_jobs
- Cron job: for scheduled execution
- Manual: python manage.py run_pipeline_jobs

It picks up PENDING pipeline runs and executes them sequentially.
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from experiments.models import PipelineRun
from experiments.pipeline_runner import run_pipeline
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Process pending pipeline runs'

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=10,
            help='Maximum number of runs to process (default: 10)'
        )
        parser.add_argument(
            '--run-id',
            type=str,
            help='Process a specific pipeline run by ID'
        )

    def handle(self, *args, **options):
        limit = options['limit']
        run_id = options.get('run_id')

        if run_id:
            # Process specific run
            try:
                pipeline_run = PipelineRun.objects.get(id=run_id)
                self.stdout.write(f"Processing pipeline run: {pipeline_run.id}")
                success = run_pipeline(pipeline_run)
                
                if success:
                    self.stdout.write(self.style.SUCCESS(
                        f"✓ Pipeline run {pipeline_run.id} completed successfully"
                    ))
                else:
                    self.stdout.write(self.style.ERROR(
                        f"✗ Pipeline run {pipeline_run.id} failed"
                    ))
            except PipelineRun.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Pipeline run {run_id} not found"))
                return
        else:
            # Process pending runs
            pending_runs = PipelineRun.objects.filter(
                status='PENDING'
            ).order_by('created_at')[:limit]

            if not pending_runs.exists():
                self.stdout.write("No pending pipeline runs found")
                return

            self.stdout.write(f"Found {pending_runs.count()} pending pipeline run(s)")

            success_count = 0
            failure_count = 0

            for pipeline_run in pending_runs:
                self.stdout.write(f"\nProcessing: {pipeline_run}")
                self.stdout.write(f"  Stage: {pipeline_run.stage}")
                self.stdout.write(f"  Scan: {pipeline_run.mri_scan}")

                success = run_pipeline(pipeline_run)

                if success:
                    success_count += 1
                    self.stdout.write(self.style.SUCCESS("  ✓ Success"))
                else:
                    failure_count += 1
                    self.stdout.write(self.style.ERROR("  ✗ Failed"))

            # Summary
            self.stdout.write("\n" + "="*50)
            self.stdout.write(self.style.SUCCESS(f"Completed: {success_count}"))
            if failure_count > 0:
                self.stdout.write(self.style.ERROR(f"Failed: {failure_count}"))
            self.stdout.write("="*50)
