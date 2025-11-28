"""
Tests for pipeline orchestration functionality.
"""

from django.test import TestCase
from django.core.management import call_command
from io import StringIO
from experiments.models import Organoid, MRIScan, PipelineRun, SegmentationResult, Metric
from experiments.pipeline_runner import PipelineRunner, run_pipeline


class PipelineRunnerTest(TestCase):
    """Test cases for PipelineRunner."""
    
    def setUp(self):
        self.organoid = Organoid.objects.create(
            name="Test Organoid",
            species="HUMAN"
        )
        self.scan = MRIScan.objects.create(
            organoid=self.organoid,
            sequence_type="T1W",
            resolution="100 μm",
            file_path="/data/test_scan.nii.gz"
        )
    
    def test_preprocessing_execution(self):
        """Test preprocessing stage execution."""
        run = PipelineRun.objects.create(
            mri_scan=self.scan,
            stage="PREPROCESSING",
            status="PENDING"
        )
        
        runner = PipelineRunner(run)
        success = runner.execute()
        
        self.assertTrue(success)
        run.refresh_from_db()
        self.assertEqual(run.status, "SUCCESS")
        self.assertIsNotNone(run.started_at)
        self.assertIsNotNone(run.finished_at)
        self.assertIn("PREPROCESSING", run.log_excerpt)
    
    def test_gmm_execution_creates_result(self):
        """Test GMM stage creates segmentation result and metrics."""
        run = PipelineRun.objects.create(
            mri_scan=self.scan,
            stage="GMM",
            status="PENDING"
        )
        
        runner = PipelineRunner(run)
        success = runner.execute()
        
        self.assertTrue(success)
        run.refresh_from_db()
        self.assertEqual(run.status, "SUCCESS")
        
        # Check segmentation result was created
        self.assertTrue(hasattr(run, 'segmentation_result'))
        result = run.segmentation_result
        self.assertIn("gmm", result.mask_path.lower())
        
        # Check metrics were created
        metrics = result.metrics.all()
        self.assertEqual(metrics.count(), 3)
        
        metric_names = [m.metric_name for m in metrics]
        self.assertIn("Dice", metric_names)
        self.assertIn("IoU", metric_names)
        self.assertIn("Volume", metric_names)
    
    def test_unet_execution(self):
        """Test U-Net stage execution."""
        run = PipelineRun.objects.create(
            mri_scan=self.scan,
            stage="UNET",
            status="PENDING"
        )
        
        success = run_pipeline(run)
        
        self.assertTrue(success)
        run.refresh_from_db()
        self.assertEqual(run.status, "SUCCESS")
        self.assertTrue(hasattr(run, 'segmentation_result'))
    
    def test_cli_command_generation(self):
        """Test CLI command string generation using settings template."""
        run = PipelineRun.objects.create(
            mri_scan=self.scan,
            stage="GMM",
            status="PENDING",
            config_json={"n_components": 3}
        )
        
        runner = PipelineRunner(run)
        cmd = runner._build_cli_command("gmm")
        
        # Should match the default template in settings
        self.assertIn("python -m mri_pipeline.gmm", cmd)
        self.assertIn(f"--input {self.scan.file_path}", cmd)
        self.assertIn("--n_components 3", cmd)

    def test_real_mode_execution(self):
        """Test execution in 'real' mode (mocked subprocess)."""
        run = PipelineRun.objects.create(
            mri_scan=self.scan,
            stage="PREPROCESSING",
            status="PENDING"
        )
        
        runner = PipelineRunner(run)
        runner.mode = 'real'  # Force real mode
        
        # Mock the _execute_real_command method to avoid actual subprocess
        # We want to test that it calls this method
        original_execute_real = runner._execute_real_command
        called = False
        
        def mock_execute_real(cmd):
            nonlocal called
            called = True
            return True
            
        runner._execute_real_command = mock_execute_real
        
        success = runner.execute()
        
        self.assertTrue(success)
        self.assertTrue(called)
        
        # Verify status update
        run.refresh_from_db()
        self.assertEqual(run.status, "SUCCESS")
        self.assertIsNotNone(run.cli_command)


class ManagementCommandTest(TestCase):
    """Test cases for run_pipeline_jobs management command."""
    
    def setUp(self):
        self.organoid = Organoid.objects.create(
            name="Test Organoid",
            species="MARMOSET"
        )
        self.scan = MRIScan.objects.create(
            organoid=self.organoid,
            sequence_type="T2W",
            resolution="100 μm"
        )
    
    def test_command_processes_pending_runs(self):
        """Test that command processes pending runs."""
        # Create pending runs
        run1 = PipelineRun.objects.create(
            mri_scan=self.scan,
            stage="PREPROCESSING",
            status="PENDING"
        )
        run2 = PipelineRun.objects.create(
            mri_scan=self.scan,
            stage="GMM",
            status="PENDING"
        )
        
        # Run command
        out = StringIO()
        call_command('run_pipeline_jobs', stdout=out)
        
        # Check runs were processed
        run1.refresh_from_db()
        run2.refresh_from_db()
        
        self.assertEqual(run1.status, "SUCCESS")
        self.assertEqual(run2.status, "SUCCESS")
        
        output = out.getvalue()
        self.assertIn("Completed: 2", output)
    
    def test_command_with_specific_run_id(self):
        """Test processing a specific run by ID."""
        run = PipelineRun.objects.create(
            mri_scan=self.scan,
            stage="GMM",
            status="PENDING"
        )
        
        out = StringIO()
        call_command('run_pipeline_jobs', run_id=str(run.id), stdout=out)
        
        run.refresh_from_db()
        self.assertEqual(run.status, "SUCCESS")
    
    def test_command_with_limit(self):
        """Test that limit parameter works."""
        # Create 3 pending runs
        for i in range(3):
            PipelineRun.objects.create(
                mri_scan=self.scan,
                stage="PREPROCESSING",
                status="PENDING"
            )
        
        # Process only 2
        out = StringIO()
        call_command('run_pipeline_jobs', limit=2, stdout=out)
        
        # Check only 2 were processed
        completed = PipelineRun.objects.filter(status="SUCCESS").count()
        pending = PipelineRun.objects.filter(status="PENDING").count()
        
        self.assertEqual(completed, 2)
        self.assertEqual(pending, 1)
