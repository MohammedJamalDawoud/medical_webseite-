from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExperimentConfigViewSet,
    ModelVersionViewSet,
    OrganoidViewSet,
    MRIScanViewSet,
    PipelineRunViewSet,
    SegmentationResultViewSet,
    MetricViewSet
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'experiment-configs', ExperimentConfigViewSet, basename='experimentconfig')
router.register(r'model-versions', ModelVersionViewSet, basename='modelversion')
router.register(r'organoids', OrganoidViewSet, basename='organoid')
router.register(r'scans', MRIScanViewSet, basename='scan')
router.register(r'pipeline-runs', PipelineRunViewSet, basename='pipelinerun')
router.register(r'segmentation-results', SegmentationResultViewSet, basename='segmentationresult')
router.register(r'metrics', MetricViewSet, basename='metric')

urlpatterns = [
    path('', include(router.urls)),
]
