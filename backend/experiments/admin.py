from django.contrib import admin
from experiments.models import (
    ExperimentConfig,
    ModelVersion,
    Organoid,
    MRIScan,
    PipelineRun,
    SegmentationResult,
    Metric
)


@admin.register(ExperimentConfig)
class ExperimentConfigAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at', 'updated_at']
    search_fields = ['name', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at']


@admin.register(ModelVersion)
class ModelVersionAdmin(admin.ModelAdmin):
    list_display = ['name', 'weights_path', 'created_at']
    search_fields = ['name', 'description', 'training_dataset_description']
    readonly_fields = ['id', 'created_at']


@admin.register(Organoid)
class OrganoidAdmin(admin.ModelAdmin):
    list_display = ['name', 'species', 'experiment_id', 'created_at']
    list_filter = ['species']
    search_fields = ['name', 'description', 'experiment_id']
    readonly_fields = ['id', 'created_at']


@admin.register(MRIScan)
class MRIScanAdmin(admin.ModelAdmin):
    list_display = ['organoid', 'sequence_type', 'acquisition_date', 'resolution']
    list_filter = ['sequence_type']
    search_fields = ['organoid__name', 'file_path']
    readonly_fields = ['id', 'created_at']


@admin.register(PipelineRun)
class PipelineRunAdmin(admin.ModelAdmin):
    list_display = ['mri_scan', 'stage', 'status', 'experiment_config', 'model_version', 'started_at']
    list_filter = ['stage', 'status']
    search_fields = ['mri_scan__organoid__name']
    readonly_fields = ['id', 'created_at']


@admin.register(SegmentationResult)
class SegmentationResultAdmin(admin.ModelAdmin):
    list_display = ['pipeline_run', 'model_version', 'created_at']
    search_fields = ['pipeline_run__mri_scan__organoid__name']
    readonly_fields = ['id', 'created_at']


@admin.register(Metric)
class MetricAdmin(admin.ModelAdmin):
    list_display = ['segmentation_result', 'metric_name', 'metric_value', 'unit', 'created_at']
    list_filter = ['metric_name']
    search_fields = ['segmentation_result__pipeline_run__mri_scan__organoid__name']
    readonly_fields = ['id', 'created_at']
