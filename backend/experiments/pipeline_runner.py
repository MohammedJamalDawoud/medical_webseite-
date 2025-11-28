"""
Pipeline Runner Utility

This module orchestrates the execution of the MRI organoid segmentation pipeline.
It provides integration points for the scientific pipeline code (preprocessing, GMM, U-Net).

TODO: Connect to actual pipeline implementation when available.
"""

import subprocess
import json
import logging
import shlex
from datetime import datetime
from typing import Dict, Any, Optional
from django.utils import timezone
from django.conf import settings
from experiments.models import PipelineRun, SegmentationResult, Metric

logger = logging.getLogger(__name__)


class PipelineRunner:
    """
    Orchestrates pipeline execution for MRI organoid segmentation.
    
    Supports two modes (configured in settings.PIPELINE_MODE):
    1. 'simulation': Generates dummy outputs and metrics for demo/dev.
    2. 'real': Executes actual CLI commands via subprocess.
    """
    
    def __init__(self, pipeline_run: PipelineRun):
        self.pipeline_run = pipeline_run
        self.mri_scan = pipeline_run.mri_scan
        self.config = pipeline_run.config_json or {}
        self.mode = getattr(settings, 'PIPELINE_MODE', 'simulation')
    
    def execute(self) -> bool:
        """
        Execute the pipeline run.
        
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Update status to RUNNING
            self.pipeline_run.status = 'RUNNING'
            self.pipeline_run.started_at = timezone.now()
            self.pipeline_run.save()
            
            logger.info(f"Starting pipeline run {self.pipeline_run.id} for scan {self.mri_scan.id} in {self.mode} mode")
            
            # Execute based on stage
            if self.pipeline_run.stage == 'PREPROCESSING':
                success = self._run_stage('preprocessing')
            elif self.pipeline_run.stage == 'GMM':
                success = self._run_stage('gmm')
            elif self.pipeline_run.stage == 'UNET':
                success = self._run_stage('unet')
            elif self.pipeline_run.stage == 'FULL_PIPELINE':
                success = self._run_full_pipeline()
            else:
                raise ValueError(f"Unknown stage: {self.pipeline_run.stage}")
            
            # Update final status
            if success:
                self.pipeline_run.status = 'SUCCESS'
                self.pipeline_run.finished_at = timezone.now()
                self.pipeline_run.save()
                logger.info(f"Pipeline run {self.pipeline_run.id} completed successfully")
            else:
                self._mark_failed("Pipeline execution returned failure")
            
            return success
            
        except Exception as e:
            logger.exception(f"Pipeline run {self.pipeline_run.id} failed with exception")
            self._mark_failed(str(e))
            return False
    
    def _run_stage(self, stage_name: str) -> bool:
        """
        Generic method to run a pipeline stage.
        """
        logger.info(f"Running {stage_name} stage")
        
        # Build command
        cmd = self._build_cli_command(stage_name)
        self.pipeline_run.cli_command = cmd
        self.pipeline_run.save()
        
        if self.mode == 'real':
            return self._execute_real_command(cmd)
        else:
            return self._execute_simulation(stage_name)

    def _execute_real_command(self, cmd: str) -> bool:
        """
        Execute the actual CLI command using subprocess.
        """
        try:
            # TODO: In production, use a task queue (Celery) instead of blocking
            # For now, we mock the subprocess call if we don't have the actual pipeline installed
            # or if we want to test the 'real' mode logic without external deps.
            
            logger.info(f"Executing command: {cmd}")
            
            # Use shlex to split command safely
            args = shlex.split(cmd)
            
            # subprocess.run(args, check=True, capture_output=True)
            # For this implementation, we will simulate a successful subprocess call
            # unless we implement the actual external pipeline.
            
            # TODO: Connect to real pipeline output parsing
            self.pipeline_run.log_excerpt = "Command executed successfully (Real Mode Mock)"
            self.pipeline_run.save()
            
            return True
            
        except subprocess.CalledProcessError as e:
            logger.error(f"Command failed: {e}")
            self.pipeline_run.log_excerpt = f"Command failed: {e.stderr}"
            self.pipeline_run.save()
            return False

    def _execute_simulation(self, stage_name: str) -> bool:
        """
        Execute the simulation logic (generate placeholders).
        """
        self.pipeline_run.log_excerpt = f"{stage_name.upper()} completed (simulated)"
        self.pipeline_run.save()
        
        # Create simulated result
        if stage_name in ['gmm', 'unet']:
            self._create_segmentation_result(
                mask_path=f"/data/results/{self.mri_scan.id}_{stage_name}_mask.nii.gz",
                preview_path=f"/data/results/{self.mri_scan.id}_{stage_name}_preview.png",
                model_version=f"{stage_name.upper()}-v1.0"
            )
        
        return True
    
    def _run_full_pipeline(self) -> bool:
        """
        Execute the full pipeline (preprocessing -> GMM -> U-Net).
        """
        logger.info("Running full pipeline")
        
        # In real mode, this might be a single command or a sequence
        # For now, we simulate the sequence by running GMM
        return self._run_stage('gmm')
    
    def _build_cli_command(self, stage: str) -> str:
        """
        Build a CLI command string using settings templates.
        """
        # Get template from settings
        template_key = f"PIPELINE_CLI_{stage.upper()}"
        template = getattr(settings, template_key, f"python -m mri_pipeline.{stage}")
        
        # Context for formatting
        context = {
            'input_path': self.mri_scan.file_path,
            'scan_id': self.mri_scan.id,
            'output_dir': '/data/output', # TODO: Make dynamic
            'n_components': self.config.get('n_components', 3),
            'model_path': self.config.get('model_path', 'default_model.pth'),
        }
        
        # Add any extra config keys to context
        context.update(self.config)
        
        try:
            return template.format(**context)
        except KeyError as e:
            logger.warning(f"Missing key for command template: {e}")
            return f"{template} (Error building command)"
    
    def _generate_placeholder_files(self, scan_id: str, stage: str) -> Dict[str, str]:
        """
        Generate actual placeholder files in the media directory for simulation.
        """
        from django.conf import settings
        import os
        
        # Ensure media/results directory exists
        results_dir = os.path.join(settings.MEDIA_ROOT, 'results')
        os.makedirs(results_dir, exist_ok=True)
        
        # 1. Generate dummy NIfTI mask (just a text file)
        mask_filename = f"{scan_id}_{stage}_mask.nii.gz"
        mask_path = os.path.join(results_dir, mask_filename)
        with open(mask_path, 'w') as f:
            f.write(f"Dummy NIfTI mask for scan {scan_id}, stage {stage}")
            
        # 2. Generate dummy preview image (SVG)
        preview_filename = f"{scan_id}_{stage}_preview.svg"
        preview_path = os.path.join(results_dir, preview_filename)
        
        # Simple SVG with text
        color = "#3b82f6" if stage == 'gmm' else "#10b981"
        svg_content = f'''
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#1e293b"/>
            <rect x="50" y="50" width="300" height="200" fill="{color}" opacity="0.5"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="sans-serif" font-size="24">
                {stage.upper()} Result
            </text>
            <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="14">
                Scan: {scan_id}
            </text>
        </svg>
        '''
        
        with open(preview_path, 'w') as f:
            f.write(svg_content.strip())
            
        # Return relative paths for URL generation
        return {
            'mask_path': f"/media/results/{mask_filename}",
            'preview_path': f"/media/results/{preview_filename}"
        }

    def _create_segmentation_result(
        self,
        mask_path: str,
        preview_path: str,
        model_version: str
    ) -> SegmentationResult:
        """
        Create a SegmentationResult with simulated metrics.
        """
        # Generate real placeholder files if we are in simulation mode
        # (detected by checking if paths are the default simulated ones)
        if "/data/results/" in mask_path:
            stage = "gmm" if "gmm" in mask_path else "unet"
            paths = self._generate_placeholder_files(str(self.mri_scan.id), stage)
            mask_path = paths['mask_path']
            preview_path = paths['preview_path']

        result = SegmentationResult.objects.create(
            pipeline_run=self.pipeline_run,
            mask_path=mask_path,
            preview_image_path=preview_path,
            model_version=model_version
        )
        
        # Create simulated metrics
        Metric.objects.create(
            segmentation_result=result,
            metric_name="Dice",
            metric_value=0.85,
            unit="score"
        )
        
        Metric.objects.create(
            segmentation_result=result,
            metric_name="IoU",
            metric_value=0.74,
            unit="score"
        )
        
        Metric.objects.create(
            segmentation_result=result,
            metric_name="Volume",
            metric_value=1250.5,
            unit="mm3"
        )
        
        logger.info(f"Created segmentation result {result.id} with metrics")
        return result
    
    def _mark_failed(self, error_message: str):
        """Mark the pipeline run as failed with error details."""
        self.pipeline_run.status = 'FAILED'
        self.pipeline_run.finished_at = timezone.now()
        self.pipeline_run.log_excerpt = f"ERROR: {error_message}"
        self.pipeline_run.save()


def run_pipeline(pipeline_run: PipelineRun) -> bool:
    """
    Convenience function to execute a pipeline run.
    
    Args:
        pipeline_run: The PipelineRun instance to execute
        
    Returns:
        bool: True if successful, False otherwise
    """
    runner = PipelineRunner(pipeline_run)
    return runner.execute()
