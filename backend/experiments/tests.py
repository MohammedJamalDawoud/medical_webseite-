from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import OrganoidSample, MRIScan, ProcessingStep, SegmentationResult, PublicationOrPoster
from datetime import date


class OrganoidSampleModelTest(TestCase):
    """Test cases for OrganoidSample model."""
    
    def setUp(self):
        self.organoid = OrganoidSample.objects.create(
            name="Test Organoid 1",
            species="MARMOSET",
            description="Test marmoset brain organoid",
            date_created=date(2024, 1, 15)
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
    """Test cases for OrganoidSample API endpoints."""
    
    def setUp(self):
        self.organoid = OrganoidSample.objects.create(
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
        self.assertEqual(OrganoidSample.objects.count(), 2)
    
    def test_retrieve_organoid(self):
        """Test retrieving single organoid."""
        response = self.client.get(f'/api/organoids/{self.organoid.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'API Test Organoid')


class MRIScanModelTest(TestCase):
    """Test cases for MRIScan model."""
    
    def setUp(self):
        self.organoid = OrganoidSample.objects.create(
            name="Test Organoid",
            species="MARMOSET",
            description="Test organoid"
        )
        self.scan = MRIScan.objects.create(
            organoid=self.organoid,
            modality="T2W",
            sequence_name="RARE T2",
            resolution="100 μm isotropic",
            field_strength="9.4 T",
            acquisition_date=date(2024, 2, 1)
        )
    
    def test_scan_creation(self):
        """Test MRI scan creation."""
        self.assertEqual(self.scan.modality, "T2W")
        self.assertEqual(self.scan.organoid, self.organoid)
        self.assertEqual(self.scan.field_strength, "9.4 T")
    
    def test_scan_organoid_relationship(self):
        """Test foreign key relationship."""
        self.assertEqual(self.organoid.scans.count(), 1)
        self.assertEqual(self.organoid.scans.first(), self.scan)
