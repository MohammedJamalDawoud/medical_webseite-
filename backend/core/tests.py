from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import ContactMessage, FAQ

class ContactMessageModelTest(TestCase):
    """Test cases for ContactMessage model."""

    def test_create_contact_message(self):
        message = ContactMessage.objects.create(
            name="John Doe",
            email="john@example.com",
            subject="Test Subject",
            message="Test Message"
        )
        self.assertEqual(message.name, "John Doe")
        self.assertEqual(message.email, "john@example.com")
        self.assertIsNotNone(message.created_at)

class FAQModelTest(TestCase):
    """Test cases for FAQ model."""

    def test_create_faq(self):
        faq = FAQ.objects.create(
            question="What is this?",
            answer="It is a test.",
            order=1,
            is_active=True
        )
        self.assertEqual(faq.question, "What is this?")
        self.assertTrue(faq.is_active)

class ContactAPITest(APITestCase):
    """Test cases for Contact API."""

    def test_send_contact_message(self):
        data = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "subject": "API Test",
            "message": "Hello from API"
        }
        response = self.client.post('/api/contact/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.count(), 1)

    def test_invalid_email(self):
        data = {
            "name": "Jane Doe",
            "email": "invalid-email",
            "subject": "API Test",
            "message": "Hello"
        }
        response = self.client.post('/api/contact/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class FAQAPITest(APITestCase):
    """Test cases for FAQ API."""

    def setUp(self):
        FAQ.objects.create(question="Q1", answer="A1", order=1, is_active=True)
        FAQ.objects.create(question="Q2", answer="A2", order=2, is_active=False)

    def test_list_faqs(self):
        response = self.client.get('/api/faqs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Handle pagination
        if 'results' in response.data:
            results = response.data['results']
        else:
            results = response.data
            
        # Should only return active FAQs
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['question'], "Q1")
