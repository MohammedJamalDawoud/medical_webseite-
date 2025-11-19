from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import OrganoidSample, MRIScan, ProcessingStep, SegmentationResult, PublicationOrPoster
from .serializers import (
    OrganoidSampleSerializer,
    MRIScanSerializer,
    ProcessingStepSerializer,
    SegmentationResultSerializer,
    PublicationOrPosterSerializer
)


class OrganoidSampleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing organoid samples.
    Provides CRUD operations for brain organoid experiments.
    """
    queryset = OrganoidSample.objects.all()
    serializer_class = OrganoidSampleSerializer
    permission_classes = [AllowAny]


class MRIScanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing MRI scans.
    Supports filtering by organoid and modality.
    """
    queryset = MRIScan.objects.all()
    serializer_class = MRIScanSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Allow filtering by organoid_id
        organoid_id = self.request.query_params.get('organoid', None)
        if organoid_id is not None:
            queryset = queryset.filter(organoid_id=organoid_id)
        return queryset


class ProcessingStepViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing processing pipeline steps.
    Tracks N4 bias correction, normalization, GMM, U-Net segmentation, etc.
    """
    queryset = ProcessingStep.objects.all()
    serializer_class = ProcessingStepSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        # Allow filtering by scan_id
        scan_id = self.request.query_params.get('scan', None)
        if scan_id is not None:
            queryset = queryset.filter(scan_id=scan_id)
        return queryset


class SegmentationResultViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing segmentation results.
    Stores evaluation metrics like Dice score and Jaccard index.
    """
    queryset = SegmentationResult.objects.all()
    serializer_class = SegmentationResultSerializer
    permission_classes = [AllowAny]


class PublicationOrPosterViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing scientific publications, posters, and talks.
    """
    queryset = PublicationOrPoster.objects.all()
    serializer_class = PublicationOrPosterSerializer
    permission_classes = [AllowAny]
