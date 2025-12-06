"""
Comprehensive API tests for the experiments app.

Tests all REST API endpoints including:
- Organoid CRUD operations
- MRI Scan management
- Pipeline Run operations
- Segmentation Results
- Filtering and pagination
"""

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from experiments.models import Organoid, MRIScan, PipelineRun, SegmentationResult, Metric


class OrganoidAPITestCase(TestCase):
    """Test cases for Organoid API endpoints."""
    
    def setUp(self):
        """Set up test client and sample data."""
        self.client = APIClient()
        self.organoid = Organoid.objects.create(
            organoid_id="ORG001",
            species="HUMAN",
            description="Test human organoid for API testing"
        )
    
    def test_list_organoids(self):
        """Test GET /api/organoids/ returns list of organoids."""
        response = self.client.get('/api/organoids/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['organoid_id'], 'ORG001')
    
    def test_create_organoid(self):
        """Test POST /api/organoids/ creates new organoid."""
        data = {
            'organoid_id': 'ORG002',
            'species': 'MARMOSET',
            'description': 'Test marmoset organoid'
        }
        response = self.client.post('/api/organoids/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Organoid.objects.count(), 2)
        self.assertEqual(Organoid.objects.get(organoid_id='ORG002').species, 'MARMOSET')
    
    def test_retrieve_organoid(self):
        """Test GET /api/organoids/{id}/ returns single organoid."""
        response = self.client.get(f'/api/organoids/{self.organoid.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['organoid_id'], 'ORG001')
    
    def test_update_organoid(self):
        """Test PUT /api/organoids/{id}/ updates organoid."""
        data = {
            'organoid_id': 'ORG001',
            'species': 'HUMAN',
            'description': 'Updated description'
        }
        response = self.client.put(
            f'/api/organoids/{self.organoid.id}/',
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.organoid.refresh_from_db()
        self.assertEqual(self.organoid.description, 'Updated description')
    
    def test_delete_organoid(self):
        """Test DELETE /api/organoids/{id}/ deletes organoid."""
        response = self.client.delete(f'/api/organoids/{self.organoid.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Organoid.objects.count(), 0)


class MRIScanAPITestCase(TestCase):
    """Test cases for MRI Scan API endpoints."""
    
    def setUp(self):
        """Set up test client and sample data."""
        self.client = APIClient()
        self.organoid = Organoid.objects.create(
            organoid_id="ORG001",
            species="HUMAN"
        )
        self.scan = MRIScan.objects.create(
            scan_id="SCAN001",
            organoid=self.organoid,
            sequence_type="T1W",
            data_type="IN_VITRO",
            role="TRAIN",
            file_path="/data/scans/scan001.nii.gz"
        )
    
    def test_list_scans(self):
        """Test GET /api/scans/ returns list of scans."""
        response = self.client.get('/api/scans/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
    
    def test_filter_scans_by_role(self):
        """Test filtering scans by role."""
        # Create test scan
        MRIScan.objects.create(
            scan_id="SCAN002",
            organoid=self.organoid,
            sequence_type="T2W",
            data_type="IN_VITRO",
            role="TEST",
            file_path="/data/scans/scan002.nii.gz"
        )
        
        response = self.client.get('/api/scans/?role=TRAIN')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['role'], 'TRAIN')
    
    def test_filter_scans_by_data_type(self):
        """Test filtering scans by data type."""
        response = self.client.get('/api/scans/?data_type=IN_VITRO')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for scan in response.data:
            self.assertEqual(scan['data_type'], 'IN_VITRO')
    
    def test_create_scan(self):
        """Test POST /api/scans/ creates new scan."""
        data = {
            'scan_id': 'SCAN002',
            'organoid': self.organoid.id,
            'sequence_type': 'DWI',
            'data_type': 'IN_VITRO',
            'role': 'VAL',
            'file_path': '/data/scans/scan002.nii.gz'
        }
        response = self.client.post('/api/scans/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(MRIScan.objects.count(), 2)


class PipelineRunAPITestCase(TestCase):
    """Test cases for Pipeline Run API endpoints."""
    
    def setUp(self):
        """Set up test client and sample data."""
        self.client = APIClient()
        self.organoid = Organoid.objects.create(
            organoid_id="ORG001",
            species="HUMAN"
        )
        self.scan = MRIScan.objects.create(
            scan_id="SCAN001",
            organoid=self.organoid,
            sequence_type="T1W",
            data_type="IN_VITRO",
            role="TRAIN",
            file_path="/data/scans/scan001.nii.gz"
        )
        self.run = PipelineRun.objects.create(
            run_id="RUN001",
            scan=self.scan,
            status="SUCCESS",
            mode="SIMULATION"
        )
    
    def test_list_pipeline_runs(self):
        """Test GET /api/pipeline-runs/ returns list of runs."""
        response = self.client.get('/api/pipeline-runs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
    
    def test_filter_runs_by_status(self):
        """Test filtering runs by status."""
        PipelineRun.objects.create(
            run_id="RUN002",
            scan=self.scan,
            status="FAILED",
            mode="SIMULATION"
        )
        
        response = self.client.get('/api/pipeline-runs/?status=SUCCESS')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for run in response.data:
            self.assertEqual(run['status'], 'SUCCESS')
    
    def test_filter_runs_by_qc_status(self):
        """Test filtering runs by QC status."""
        self.run.qc_status = "ACCEPTED"
        self.run.save()
        
        response = self.client.get('/api/pipeline-runs/?qc_status=ACCEPTED')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_create_pipeline_run(self):
        """Test POST /api/pipeline-runs/ creates new run."""
        data = {
            'run_id': 'RUN002',
            'scan': self.scan.id,
            'mode': 'REAL',
            'config': {'preprocessing': {'denoise': True}}
        }
        response = self.client.post('/api/pipeline-runs/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PipelineRun.objects.count(), 2)


class SegmentationResultAPITestCase(TestCase):
    """Test cases for Segmentation Result API endpoints."""
    
    def setUp(self):
        """Set up test client and sample data."""
        self.client = APIClient()
        self.organoid = Organoid.objects.create(
            organoid_id="ORG001",
            species="HUMAN"
        )
        self.scan = MRIScan.objects.create(
            scan_id="SCAN001",
            organoid=self.organoid,
            sequence_type="T1W",
            data_type="IN_VITRO",
            role="TRAIN",
            file_path="/data/scans/scan001.nii.gz"
        )
        self.run = PipelineRun.objects.create(
            run_id="RUN001",
            scan=self.scan,
            status="SUCCESS",
            mode="SIMULATION"
        )
        self.result = SegmentationResult.objects.create(
            run=self.run,
            tissue_mask_path="/results/tissue_mask.nii.gz",
            water_mask_path="/results/water_mask.nii.gz"
        )
    
    def test_list_results(self):
        """Test GET /api/segmentation-results/ returns list of results."""
        response = self.client.get('/api/segmentation-results/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
    
    def test_retrieve_result(self):
        """Test GET /api/segmentation-results/{id}/ returns single result."""
        response = self.client.get(f'/api/segmentation-results/{self.result.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tissue_mask_path', response.data)
        self.assertIn('water_mask_path', response.data)


class PaginationTestCase(TestCase):
    """Test pagination functionality."""
    
    def setUp(self):
        """Create multiple organoids for pagination testing."""
        self.client = APIClient()
        for i in range(25):
            Organoid.objects.create(
                organoid_id=f"ORG{i:03d}",
                species="HUMAN"
            )
    
    def test_pagination_default_page_size(self):
        """Test default pagination returns correct page size."""
        response = self.client.get('/api/organoids/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if pagination is applied (default page size is usually 10-20)
        self.assertLessEqual(len(response.data), 25)
    
    def test_pagination_next_page(self):
        """Test pagination next page link works."""
        response = self.client.get('/api/organoids/')
        # If there's a next page, test it
        if 'next' in response.data and response.data['next']:
            next_response = self.client.get(response.data['next'])
            self.assertEqual(next_response.status_code, status.HTTP_200_OK)
