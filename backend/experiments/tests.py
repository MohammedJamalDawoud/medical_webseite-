from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Organoid, MRIScan, PipelineRun, SegmentationResult, Metric
from datetime import date


class OrganoidModelTest(TestCase):
    """Test cases for Organoid model."""
    
    def setUp(self):
        self.organoid = Organoid.objects.create(
            name="Test Organoid 1",
            species="MARMOSET",
            experiment_id="EXP001",
            description="Test marmoset brain organoid"
        )
    
    def test_organoid_creation(self):
        """Test that organoid is created successfully."""
        self.assertEqual(self.organoid.name, "Test Organoid 1")
        self.assertEqual(self.organoid.species, "MARMOSET")
        self.assertIsNotNone(self.organoid.id)
    
    def test_organoid_str(self):
        """Test string representation."""
        self.assertEqual(str(self.organoid), "Test Organoid 1 (MARMOSET)")


class OrganoidAPITest(APITestCase):
    """Test cases for Organoid API endpoints."""
    
    def setUp(self):
        self.organoid = Organoid.objects.create(
            name="API Test Organoid",
            species="HUMAN",
            description="Test human brain organoid"
        )
    
    def test_list_organoids(self):
        """Test listing organoids via API."""
        response = self.client.get('/api/organoids/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
    
    def test_create_organoid(self):
        """Test creating organoid via API."""
        data = {
            'name': 'New Organoid',
            'species': 'MARMOSET',
            'description': 'New test organoid'
        }
        response = self.client.post('/api/organoids/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Organoid.objects.count(), 2)
    
    def test_retrieve_organoid(self):
        """Test retrieving single organoid."""
        response = self.client.get(f'/api/organoids/{self.organoid.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'API Test Organoid')


class MRIScanModelTest(TestCase):
    """Test cases for MRIScan model."""
    
    def setUp(self):
        self.organoid = Organoid.objects.create(
            name="Test Organoid",
            species="MARMOSET",
            description="Test organoid"
        )
        self.scan = MRIScan.objects.create(
            organoid=self.organoid,
            sequence_type="T2W",
            resolution="100 μm isotropic",
            file_path="/data/scans/test_scan.nii.gz",
            acquisition_date=date(2024, 2, 1)
        )
    
    def test_scan_creation(self):
        """Test MRI scan creation."""
        self.assertEqual(self.scan.sequence_type, "T2W")
        self.assertEqual(self.scan.organoid, self.organoid)
        self.assertEqual(self.scan.file_path, "/data/scans/test_scan.nii.gz")
    
    def test_scan_organoid_relationship(self):
        """Test foreign key relationship."""
        self.assertEqual(self.organoid.scans.count(), 1)
        self.assertEqual(self.organoid.scans.first(), self.scan)


class PipelineRunModelTest(TestCase):
    """Test cases for PipelineRun model."""
    
    def setUp(self):
        self.organoid = Organoid.objects.create(
            name="Test Organoid",
            species="HUMAN"
        )
        self.scan = MRIScan.objects.create(
            organoid=self.organoid,
            sequence_type="T1W",
            resolution="100 μm"
        )
        self.run = PipelineRun.objects.create(
            mri_scan=self.scan,
            stage="PREPROCESSING",
            status="PENDING"
        )
    
    def test_pipeline_run_creation(self):
        """Test pipeline run creation."""
        self.assertEqual(self.run.stage, "PREPROCESSING")
        self.assertEqual(self.run.status, "PENDING")
        self.assertEqual(self.run.mri_scan, self.scan)
    
    def test_pipeline_run_scan_relationship(self):
        """Test foreign key relationship."""
        self.assertEqual(self.scan.pipeline_runs.count(), 1)
        self.assertEqual(self.scan.pipeline_runs.first(), self.run)
