from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    ExperimentConfigViewSet,
    ModelVersionViewSet,
    OrganoidViewSet,
    MRIScanViewSet,
    PipelineRunViewSet,
    SegmentationResultViewSet,
    MetricViewSet
)
from .auth_views import RegisterView, current_user, logout_view
from .upload_views import upload_scan_file, create_scan_with_upload

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
    # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='auth_login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', logout_view, name='auth_logout'),
    path('auth/me/', current_user, name='current_user'),
    
    # File upload endpoints - Phase 14A
    path('scans/<uuid:scan_id>/upload/', upload_scan_file, name='upload_scan_file'),
    path('scans/upload/', create_scan_with_upload, name='create_scan_with_upload'),
    
    # API endpoints
    path('', include(router.urls)),
]
