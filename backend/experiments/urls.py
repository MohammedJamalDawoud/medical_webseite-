from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrganoidSampleViewSet,
    MRIScanViewSet,
    ProcessingStepViewSet,
    SegmentationResultViewSet,
    PublicationOrPosterViewSet
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'organoids', OrganoidSampleViewSet, basename='organoid')
router.register(r'scans', MRIScanViewSet, basename='scan')
router.register(r'processing-steps', ProcessingStepViewSet, basename='processingstep')
router.register(r'segmentations', SegmentationResultViewSet, basename='segmentation')
router.register(r'publications', PublicationOrPosterViewSet, basename='publication')

urlpatterns = [
    path('', include(router.urls)),
]
