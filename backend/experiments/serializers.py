from rest_framework import serializers
from .models import OrganoidSample, MRIScan, ProcessingStep, SegmentationResult, PublicationOrPoster


class OrganoidSampleSerializer(serializers.ModelSerializer):
    """Serializer for OrganoidSample model."""
    scans_count = serializers.SerializerMethodField()
    
    class Meta:
        model = OrganoidSample
        fields = ['id', 'name', 'species', 'description', 'date_created', 'notes', 'scans_count']
    
    def get_scans_count(self, obj):
        return obj.scans.count()


class MRIScanSerializer(serializers.ModelSerializer):
    """Serializer for MRIScan model."""
    organoid_name = serializers.CharField(source='organoid.name', read_only=True)
    processing_steps_count = serializers.SerializerMethodField()
    
    class Meta:
        model = MRIScan
        fields = [
            'id', 'organoid', 'organoid_name', 'modality', 'sequence_name',
            'acquisition_date', 'resolution', 'field_strength', 'notes',
            'processing_steps_count'
        ]
    
    def get_processing_steps_count(self, obj):
        return obj.processing_steps.count()


class ProcessingStepSerializer(serializers.ModelSerializer):
    """Serializer for ProcessingStep model."""
    scan_info = serializers.SerializerMethodField()
    has_segmentation = serializers.SerializerMethodField()
    
    class Meta:
        model = ProcessingStep
        fields = [
            'id', 'scan', 'scan_info', 'step_type', 'status',
            'created_at', 'updated_at', 'parameters_json',
            'output_path', 'log_excerpt', 'has_segmentation'
        ]
    
    def get_scan_info(self, obj):
        return {
            'id': obj.scan.id,
            'organoid_name': obj.scan.organoid.name,
            'modality': obj.scan.modality
        }
    
    def get_has_segmentation(self, obj):
        return hasattr(obj, 'segmentation')


class SegmentationResultSerializer(serializers.ModelSerializer):
    """Serializer for SegmentationResult model."""
    processing_step_info = serializers.SerializerMethodField()
    
    class Meta:
        model = SegmentationResult
        fields = [
            'id', 'processing_step', 'processing_step_info', 'method',
            'description', 'created_at', 'dice_score', 'jaccard_index', 'notes'
        ]
    
    def get_processing_step_info(self, obj):
        return {
            'id': obj.processing_step.id,
            'step_type': obj.processing_step.step_type,
            'organoid_name': obj.processing_step.scan.organoid.name,
            'scan_modality': obj.processing_step.scan.modality
        }


class PublicationOrPosterSerializer(serializers.ModelSerializer):
    """Serializer for PublicationOrPoster model."""
    
    class Meta:
        model = PublicationOrPoster
        fields = ['id', 'title', 'pub_type', 'year', 'authors', 'venue', 'link', 'abstract']
