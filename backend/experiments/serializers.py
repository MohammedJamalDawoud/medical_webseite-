from rest_framework import serializers
from .models import Organoid, MRIScan, PipelineRun, SegmentationResult, Metric


class OrganoidSerializer(serializers.ModelSerializer):
    """Serializer for Organoid model."""
    scans_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Organoid
        fields = ['id', 'name', 'species', 'experiment_id', 'description', 'created_at', 'notes', 'scans_count']
        read_only_fields = ['id', 'created_at']
    
    def get_scans_count(self, obj):
        return obj.scans.count()


class MRIScanSerializer(serializers.ModelSerializer):
    """Serializer for MRIScan model."""
    organoid_name = serializers.CharField(source='organoid.name', read_only=True)
    pipeline_runs_count = serializers.SerializerMethodField()
    
    class Meta:
        model = MRIScan
        fields = [
            'id', 'organoid', 'organoid_name', 'sequence_type',
            'acquisition_date', 'resolution', 'file_path', 'notes',
            'created_at', 'pipeline_runs_count'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_pipeline_runs_count(self, obj):
        return obj.pipeline_runs.count()


class PipelineRunSerializer(serializers.ModelSerializer):
    """Serializer for PipelineRun model."""
    scan_info = serializers.SerializerMethodField()
    has_result = serializers.SerializerMethodField()
    
    class Meta:
        model = PipelineRun
        fields = [
            'id', 'mri_scan', 'scan_info', 'stage', 'status',
            'started_at', 'finished_at', 'log_excerpt', 'config_json',
            'docker_image', 'cli_command', 'created_at', 'has_result'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_scan_info(self, obj):
        return {
            'id': str(obj.mri_scan.id),
            'organoid_name': obj.mri_scan.organoid.name,
            'sequence_type': obj.mri_scan.sequence_type
        }
    
    def get_has_result(self, obj):
        return hasattr(obj, 'segmentation_result')


class MetricSerializer(serializers.ModelSerializer):
    """Serializer for Metric model."""
    
    class Meta:
        model = Metric
        fields = ['id', 'segmentation_result', 'metric_name', 'metric_value', 'unit', 'created_at']
        read_only_fields = ['id', 'created_at']


class SegmentationResultSerializer(serializers.ModelSerializer):
    """Serializer for SegmentationResult model."""
    pipeline_run_info = serializers.SerializerMethodField()
    metrics = MetricSerializer(many=True, read_only=True)
    
    class Meta:
        model = SegmentationResult
        fields = [
            'id', 'pipeline_run', 'pipeline_run_info', 'mask_path',
            'preview_image_path', 'model_version', 'created_at', 'metrics'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_pipeline_run_info(self, obj):
        return {
            'id': str(obj.pipeline_run.id),
            'stage': obj.pipeline_run.stage,
            'organoid_name': obj.pipeline_run.mri_scan.organoid.name,
            'sequence_type': obj.pipeline_run.mri_scan.sequence_type
        }
