from django.test import TestCase
from rest_framework.test import APIClient
from experiments.models import Organoid, MRIScan
from django.urls import reverse
import datetime

class MRIScanModelTest(TestCase):
    def setUp(self):
        self.organoid = Organoid.objects.create(name="Test Organoid", species="HUMAN")
        self.scan1 = MRIScan.objects.create(
            organoid=self.organoid,
            sequence_type="T1W",
            data_type="IN_VITRO",
            role="TRAIN",
            acquisition_date=datetime.date.today(),
            resolution="100um"
        )
        self.scan2 = MRIScan.objects.create(
            organoid=self.organoid,
            sequence_type="T2W",
            data_type="EX_VIVO",
            role="TEST",
            acquisition_date=datetime.date.today(),
            resolution="100um"
        )
        self.client = APIClient()

    def test_mri_scan_fields(self):
        """Test that new fields are saved correctly."""
        scan = MRIScan.objects.get(id=self.scan1.id)
        self.assertEqual(scan.data_type, "IN_VITRO")
        self.assertEqual(scan.role, "TRAIN")

    def test_filter_by_data_type(self):
        """Test filtering scans by data_type."""
        url = reverse('mriscan-list')
        response = self.client.get(url, {'data_type': 'IN_VITRO'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], str(self.scan1.id))

    def test_filter_by_role(self):
        """Test filtering scans by role."""
        url = reverse('mriscan-list')
        response = self.client.get(url, {'role': 'TEST'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], str(self.scan2.id))
