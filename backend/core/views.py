from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import viewsets, mixins
from rest_framework.permissions import AllowAny
from .models import ContactMessage, FAQ
from .serializers import ContactMessageSerializer, FAQSerializer

@api_view(['GET'])
def health_check(request):
    """
    Simple health check endpoint for the MRI Organoids API.
    """
    return JsonResponse({
        'status': 'ok',
        'message': 'MRI Organoids API running'
    })

class ContactMessageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    API endpoint that allows contact messages to be created.
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows FAQs to be viewed.
    """
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]
