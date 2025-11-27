from django.db import models
import uuid

class Organoid(models.Model):
    """
    Represents a brain organoid sample used in MRI experiments.
    """
    SPECIES_CHOICES = [
        ('MARMOSET', 'Marmoset'),
        ('HUMAN', 'Human'),
        ('OTHER', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    species = models.CharField(max_length=50, choices=SPECIES_CHOICES, default='MARMOSET')
    experiment_id = models.CharField(max_length=100, blank=True, help_text="External experiment identifier")
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.name} ({self.species})"
    
    class Meta:
        ordering = ['-created_at']


class MRIScan(models.Model):
    """
    Represents an MRI scan acquisition of an organoid sample.
    """
    SEQUENCE_CHOICES = [
        ('T1W', 'T1-weighted'),
        ('T2W', 'T2-weighted'),
        ('PDW', 'Proton Density-weighted'),
        ('MGE', 'Multi-Gradient Echo'),
        ('DWI', 'Diffusion-Weighted Imaging'),
        ('FLAIR', 'FLAIR'),
        ('OTHER', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organoid = models.ForeignKey(Organoid, on_delete=models.CASCADE, related_name='scans')
    sequence_type = models.CharField(max_length=50, choices=SEQUENCE_CHOICES)
    acquisition_date = models.DateField(null=True, blank=True)
    resolution = models.CharField(max_length=100, help_text="e.g., '100 μm isotropic'")
    file_path = models.CharField(max_length=500, blank=True, help_text="Path to NIfTI file")
    created_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.organoid.name} - {self.sequence_type} ({self.acquisition_date})"
    
    class Meta:
        ordering = ['-acquisition_date']


class PipelineRun(models.Model):
    """
    Represents an execution of the analysis pipeline (or a stage of it).
    """
    STAGE_CHOICES = [
        ('PREPROCESSING', 'Preprocessing'),
        ('GMM', 'GMM Segmentation'),
        ('UNET', 'U-Net Segmentation'),
        ('FULL_PIPELINE', 'Full Pipeline'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('RUNNING', 'Running'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mri_scan = models.ForeignKey(MRIScan, on_delete=models.CASCADE, related_name='pipeline_runs')
    stage = models.CharField(max_length=50, choices=STAGE_CHOICES)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDING')
    started_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)
    log_excerpt = models.TextField(blank=True)
    config_json = models.JSONField(null=True, blank=True, help_text="Configuration parameters")
    docker_image = models.CharField(max_length=200, blank=True, help_text="Docker image used")
    cli_command = models.TextField(blank=True, help_text="Command executed")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.mri_scan.organoid.name} - {self.stage} ({self.status})"
    
    class Meta:
        ordering = ['-created_at']


class SegmentationResult(models.Model):
    """
    Stores the output of a successful pipeline run (masks, previews).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pipeline_run = models.OneToOneField(PipelineRun, on_delete=models.CASCADE, related_name='segmentation_result')
    mask_path = models.CharField(max_length=500, blank=True, help_text="Path to segmentation mask")
    preview_image_path = models.CharField(max_length=500, blank=True, help_text="Path to preview PNG")
    model_version = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Result for {self.pipeline_run}"


class Metric(models.Model):
    """
    Quantitative metrics derived from the segmentation result.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    segmentation_result = models.ForeignKey(SegmentationResult, on_delete=models.CASCADE, related_name='metrics')
    metric_name = models.CharField(max_length=100, help_text="e.g., 'Dice', 'IoU', 'Volume'")
    metric_value = models.FloatField()
    unit = models.CharField(max_length=50, blank=True, help_text="e.g., 'mm3', 'score'")
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.metric_name}: {self.metric_value} {self.unit}"
