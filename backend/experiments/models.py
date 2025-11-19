from django.db import models


class OrganoidSample(models.Model):
    """
    Represents a brain organoid sample used in MRI experiments.
    Can be human, marmoset, or other species.
    """
    SPECIES_CHOICES = [
        ('MARMOSET', 'Marmoset'),
        ('HUMAN', 'Human'),
        ('OTHER', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    species = models.CharField(max_length=50, choices=SPECIES_CHOICES, default='MARMOSET')
    description = models.TextField()
    date_created = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.name} ({self.species})"
    
    class Meta:
        ordering = ['-date_created']


class MRIScan(models.Model):
    """
    Represents an MRI scan acquisition of an organoid sample.
    Supports multiple modalities: T1w, T2w, PDw, MGE, DWI, etc.
    """
    MODALITY_CHOICES = [
        ('T1W', 'T1-weighted'),
        ('T2W', 'T2-weighted'),
        ('PDW', 'Proton Density-weighted'),
        ('MGE', 'Multi-Gradient Echo'),
        ('DWI', 'Diffusion-Weighted Imaging'),
        ('FLAIR', 'FLAIR'),
        ('OTHER', 'Other'),
    ]
    
    organoid = models.ForeignKey(OrganoidSample, on_delete=models.CASCADE, related_name='scans')
    modality = models.CharField(max_length=50, choices=MODALITY_CHOICES)
    sequence_name = models.CharField(max_length=200)
    acquisition_date = models.DateField(null=True, blank=True)
    resolution = models.CharField(max_length=100, help_text="e.g., '100 μm isotropic'")
    field_strength = models.CharField(max_length=50, help_text="e.g., '9.4 T'")
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.organoid.name} - {self.modality} ({self.acquisition_date})"
    
    class Meta:
        ordering = ['-acquisition_date']


class ProcessingStep(models.Model):
    """
    Represents a single processing step in the MRI analysis pipeline.
    Tracks preprocessing (N4, normalization, denoising) and segmentation steps (GMM, U-Net).
    """
    STEP_TYPE_CHOICES = [
        ('N4_BIAS', 'N4 Bias Field Correction'),
        ('NORMALIZATION', 'Intensity Normalization'),
        ('DENOISING', 'Denoising'),
        ('GMM_SEG', 'GMM Segmentation'),
        ('UNET_SEG', 'U-Net Segmentation'),
        ('PRIMUNET_SEG', 'PrimUNet Segmentation'),
        ('OTHER', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('PLANNED', 'Planned'),
        ('RUNNING', 'Running'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]
    
    scan = models.ForeignKey(MRIScan, on_delete=models.CASCADE, related_name='processing_steps')
    step_type = models.CharField(max_length=50, choices=STEP_TYPE_CHOICES)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PLANNED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    parameters_json = models.JSONField(null=True, blank=True, help_text="Processing parameters as JSON")
    output_path = models.CharField(max_length=500, blank=True, help_text="Path to output file or URL")
    log_excerpt = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.scan.organoid.name} - {self.step_type} ({self.status})"
    
    class Meta:
        ordering = ['-created_at']


class SegmentationResult(models.Model):
    """
    Stores segmentation results and evaluation metrics.
    Links to a ProcessingStep to track which method produced the segmentation.
    """
    METHOD_CHOICES = [
        ('GMM', 'Gaussian Mixture Model'),
        ('UNET', 'U-Net'),
        ('PRIMUNET', 'PrimUNet'),
        ('GMM_UNET', 'GMM + U-Net Combined'),
        ('OTHER', 'Other'),
    ]
    
    processing_step = models.OneToOneField(ProcessingStep, on_delete=models.CASCADE, related_name='segmentation')
    method = models.CharField(max_length=50, choices=METHOD_CHOICES)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    dice_score = models.FloatField(null=True, blank=True, help_text="Dice similarity coefficient")
    jaccard_index = models.FloatField(null=True, blank=True, help_text="Jaccard index / IoU")
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.method} - {self.processing_step.scan.organoid.name}"
    
    class Meta:
        ordering = ['-created_at']


class PublicationOrPoster(models.Model):
    """
    Represents scientific outputs: posters, papers, thesis, or talks
    related to the MRI organoid segmentation project.
    """
    TYPE_CHOICES = [
        ('POSTER', 'Poster'),
        ('THESIS', 'Master Thesis'),
        ('PAPER', 'Paper'),
        ('TALK', 'Talk'),
        ('OTHER', 'Other'),
    ]
    
    title = models.CharField(max_length=500)
    pub_type = models.CharField(max_length=50, choices=TYPE_CHOICES, verbose_name='Type')
    year = models.IntegerField()
    authors = models.CharField(max_length=500)
    venue = models.CharField(max_length=500, help_text="Conference, journal, or institution")
    link = models.URLField(blank=True)
    abstract = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.title} ({self.year})"
    
    class Meta:
        ordering = ['-year']
        verbose_name = "Publication or Poster"
        verbose_name_plural = "Publications and Posters"
