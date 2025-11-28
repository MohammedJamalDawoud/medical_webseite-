from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from .models import Organoid, MRIScan, PipelineRun, SegmentationResult, Metric, ExperimentConfig, ModelVersion
from .serializers import (
    OrganoidSerializer,
    MRIScanSerializer,
    PipelineRunSerializer,
    SegmentationResultSerializer,
    MetricSerializer,
    ExperimentConfigSerializer,
    ModelVersionSerializer
)


class ExperimentConfigViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing experiment configurations.
    Stores reusable pipeline parameter sets.
    """
    queryset = ExperimentConfig.objects.all()
    serializer_class = ExperimentConfigSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'updated_at', 'name']


class ModelVersionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing model versions.
    Tracks trained model weights and metadata.
    """
    queryset = ModelVersion.objects.all()
    serializer_class = ModelVersionSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'training_dataset_description']
    ordering_fields = ['created_at', 'name']


class OrganoidViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing organoid samples.
    Provides CRUD operations for brain organoid experiments.
    """
    queryset = Organoid.objects.all()
    serializer_class = OrganoidSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'experiment_id', 'description']
    ordering_fields = ['created_at', 'name']

    def get_queryset(self):
        queryset = super().get_queryset()
        species = self.request.query_params.get('species', None)
        if species:
            queryset = queryset.filter(species=species)
        return queryset


class MRIScanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing MRI scans.
    Supports filtering by organoid and sequence type.
    """
    queryset = MRIScan.objects.all()
    serializer_class = MRIScanSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['file_path', 'notes']
    ordering_fields = ['acquisition_date', 'created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        organoid = self.request.query_params.get('organoid', None)
        sequence_type = self.request.query_params.get('sequence_type', None)
        data_type = self.request.query_params.get('data_type', None)
        role = self.request.query_params.get('role', None)
        
        if organoid:
            queryset = queryset.filter(organoid=organoid)
        if sequence_type:
            queryset = queryset.filter(sequence_type=sequence_type)
        if data_type:
            queryset = queryset.filter(data_type=data_type)
        if role:
            queryset = queryset.filter(role=role)
        return queryset


class PipelineRunViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing pipeline runs.
    Tracks preprocessing, GMM, U-Net segmentation stages.
    """
    queryset = PipelineRun.objects.all()
    serializer_class = PipelineRunSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['log_excerpt']
    ordering_fields = ['created_at', 'started_at', 'finished_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        mri_scan = self.request.query_params.get('mri_scan', None)
        stage = self.request.query_params.get('stage', None)
        status = self.request.query_params.get('status', None)
        experiment_config = self.request.query_params.get('experiment_config', None)
        model_version = self.request.query_params.get('model_version', None)
        
        if mri_scan:
            queryset = queryset.filter(mri_scan=mri_scan)
        if stage:
            queryset = queryset.filter(stage=stage)
        if status:
            queryset = queryset.filter(status=status)
        if experiment_config:
            queryset = queryset.filter(experiment_config=experiment_config)
        if model_version:
            queryset = queryset.filter(model_version=model_version)
        return queryset


class SegmentationResultViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing segmentation results.
    Stores masks, previews, and associated metrics.
    """
    queryset = SegmentationResult.objects.all()
    serializer_class = SegmentationResultSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        pipeline_run = self.request.query_params.get('pipeline_run', None)
        if pipeline_run:
            queryset = queryset.filter(pipeline_run=pipeline_run)
        return queryset


class MetricViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing quantitative metrics.
    Stores Dice, IoU, volume, and other biomarkers.
    """
    queryset = Metric.objects.all()
    serializer_class = MetricSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'metric_value']

    def get_queryset(self):
        queryset = super().get_queryset()
        segmentation_result = self.request.query_params.get('segmentation_result', None)
        metric_name = self.request.query_params.get('metric_name', None)
        if segmentation_result:
            queryset = queryset.filter(segmentation_result=segmentation_result)
        if metric_name:
            queryset = queryset.filter(metric_name=metric_name)
        return queryset
