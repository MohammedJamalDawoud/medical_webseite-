from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import (
    ExperimentConfig, ModelVersion, Organoid, MRIScan,
    PipelineRun, SegmentationResult, Metric, BIDSDataset
)
from .serializers import (
    ExperimentConfigSerializer, ModelVersionSerializer, OrganoidSerializer,
    MRIScanSerializer, PipelineRunSerializer, SegmentationResultSerializer,
    MetricSerializer, BIDSDatasetSerializer
)
from . import analytics


class ExperimentConfigViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing experiment configurations.
    Defines preprocessing and segmentation pipeline parameters.
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


# Analytics endpoints
@api_view(['GET'])
@permission_classes([AllowAny])
def analytics_overview(request):
    """
    Get overview analytics including counts and data distributions.
    
    Returns:
        - counts: Overview counts (organoids, scans, runs, etc.)
        - scans_by_species: Distribution of scans by species
        - scans_by_data_type: Distribution by data type (IN_VITRO, etc.)
        - scans_by_role: Distribution by role (TRAIN, VAL, TEST)
        - scans_by_sequence_type: Distribution by sequence type (T1W, T2W, etc.)
    """
    try:
        data = {
            'counts': analytics.get_overview_counts(),
            'scans_by_species': analytics.get_scans_by_species(),
            'scans_by_data_type': analytics.get_scans_by_data_type(),
            'scans_by_role': analytics.get_scans_by_role(),
            'scans_by_sequence_type': analytics.get_scans_by_sequence_type(),
        }
        return Response(data)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def analytics_metrics(request):
    """
    Get metrics analytics including histograms and averages.
    
    Returns:
        - histogram_dice: Histogram of Dice scores
        - histogram_iou: Histogram of IoU scores
        - avg_dice_by_model: Average Dice per model version
        - avg_dice_by_config: Average Dice per experiment config
    """
    try:
        data = {
            'histogram_dice': analytics.get_metrics_histogram_dice(),
            'histogram_iou': analytics.get_metrics_histogram_iou(),
            'avg_dice_by_model': analytics.get_avg_dice_by_model(),
            'avg_dice_by_config': analytics.get_avg_dice_by_config(),
        }
        return Response(data)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class BIDSDatasetViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing BIDS datasets.
    """
    queryset = BIDSDataset.objects.all().order_by('-created_at')
    serializer_class = BIDSDatasetSerializer
    permission_classes = [AllowAny]  # TODO: Change to IsAuthenticated for production
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'root_path', 'description']
    ordering_fields = ['created_at', 'last_validated_at']
    
    @action(detail=True, methods=['post'])
    def validate(self, request, pk=None):
        """
        Trigger BIDS validation for this dataset.
        For now, simulates validation. In production, integrate bids-validator.
        """
        from django.utils import timezone
        
        dataset = self.get_object()
        
        # Simulate validation (TODO: integrate actual bids-validator)
        # In production, this would run: bids-validator <root_path>
        dataset.last_validated_at = timezone.now()
        dataset.last_validation_status = 'PASSED'
        dataset.last_validation_summary = {
            'valid': True,
            'warnings': [],
            'errors': [],
            'message': 'Validation simulation - all checks passed'
        }
        dataset.save()
        
        return Response(self.get_serializer(dataset).data)


# Export endpoints
@api_view(['GET'])
@permission_classes([AllowAny])
def export_metrics_csv(request):
    """Export all metrics to CSV file"""
    from . import exports
    data = exports.export_metrics_csv()
    return exports.generate_csv_response(data, 'metrics_export.csv')


@api_view(['GET'])
@permission_classes([AllowAny])
def export_experiments_csv(request):
    """Export all experiment configurations to CSV file"""
    from . import exports
    data = exports.export_experiments_csv()
    return exports.generate_csv_response(data, 'experiments_export.csv')


@api_view(['GET'])
@permission_classes([AllowAny])
def export_runs_csv(request):
    """Export all pipeline runs to CSV file"""
    from . import exports
    data = exports.export_pipeline_runs_csv()
    return exports.generate_csv_response(data, 'pipeline_runs_export.csv')


@api_view(['GET'])
@permission_classes([AllowAny])
def export_analytics_csv(request):
    """Export analytics summary to CSV file"""
    from . import exports
    data = exports.export_analytics_summary_csv()
    return exports.generate_csv_response(data, 'analytics_summary.csv')
