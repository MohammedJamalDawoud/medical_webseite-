from django.contrib import admin
from experiments.models import (
    OrganoidSample,
    MRIScan,
    ProcessingStep,
    SegmentationResult,
    PublicationOrPoster
)


@admin.register(OrganoidSample)
class OrganoidSampleAdmin(admin.ModelAdmin):
    list_display = ['name', 'species', 'date_created']
    list_filter = ['species']
    search_fields = ['name', 'description']


@admin.register(MRIScan)
class MRIScanAdmin(admin.ModelAdmin):
    list_display = ['organoid', 'modality', 'sequence_name', 'acquisition_date', 'field_strength']
    list_filter = ['modality', 'field_strength']
    search_fields = ['organoid__name', 'sequence_name']


@admin.register(ProcessingStep)
class ProcessingStepAdmin(admin.ModelAdmin):
    list_display = ['scan', 'step_type', 'status', 'created_at', 'updated_at']
    list_filter = ['step_type', 'status']
    search_fields = ['scan__organoid__name']


@admin.register(SegmentationResult)
class SegmentationResultAdmin(admin.ModelAdmin):
    list_display = ['processing_step', 'method', 'dice_score', 'jaccard_index', 'created_at']
    list_filter = ['method']
    search_fields = ['processing_step__scan__organoid__name']


@admin.register(PublicationOrPoster)
class PublicationOrPosterAdmin(admin.ModelAdmin):
    list_display = ['title', 'pub_type', 'year', 'venue']
    list_filter = ['pub_type', 'year']
    search_fields = ['title', 'authors', 'venue']
