"""
Analytics module for computing experiment statistics and metrics.

This module provides functions to compute various analytics for the
MRI Organoids Segmentation platform, including:
- Overview counts (organoids, scans, runs, etc.)
- Data distributions (by species, data type, role, sequence type)
- Metrics distributions (Dice, IoU histograms)
- Performance by model/config
"""

from django.db.models import Count, Avg, Q
from django.utils import timezone
from datetime import timedelta
from experiments.models import (
    Organoid, MRIScan, PipelineRun, SegmentationResult, 
    Metric, ExperimentConfig, ModelVersion
)


def get_overview_counts():
    """
    Get high-level counts of key entities.
    
    Returns:
        dict: Dictionary with counts for organoids, scans, runs, etc.
    """
    total_runs = PipelineRun.objects.count()
    successful_runs = PipelineRun.objects.filter(status='COMPLETED').count()
    failed_runs = PipelineRun.objects.filter(status='FAILED').count()
    
    return {
        'num_organoids': Organoid.objects.count(),
        'num_scans': MRIScan.objects.count(),
        'num_pipeline_runs': total_runs,
        'num_successful_runs': successful_runs,
        'num_failed_runs': failed_runs,
        'num_models': ModelVersion.objects.count(),
        'num_configs': ExperimentConfig.objects.count(),
        'success_rate': round(successful_runs / total_runs * 100, 1) if total_runs > 0 else 0,
    }


def get_scans_by_species():
    """
    Get count of scans grouped by organoid species.
    
    Returns:
        list: List of dicts with 'label' and 'value' keys
    """
    results = MRIScan.objects.values('organoid__species').annotate(
        count=Count('id')
    ).order_by('-count')
    
    return [
        {'label': item['organoid__species'] or 'Unknown', 'value': item['count']}
        for item in results
    ]


def get_scans_by_data_type():
    """
    Get count of scans grouped by data type (IN_VITRO, EX_VIVO, IN_VIVO).
    
    Returns:
        list: List of dicts with 'label' and 'value' keys
    """
    results = MRIScan.objects.values('data_type').annotate(
        count=Count('id')
    ).order_by('-count')
    
    return [
        {'label': item['data_type'], 'value': item['count']}
        for item in results
    ]


def get_scans_by_role():
    """
    Get count of scans grouped by role (TRAIN, VAL, TEST, UNASSIGNED).
    
    Returns:
        list: List of dicts with 'label' and 'value' keys
    """
    results = MRIScan.objects.values('role').annotate(
        count=Count('id')
    ).order_by('-count')
    
    return [
        {'label': item['role'], 'value': item['count']}
        for item in results
    ]


def get_scans_by_sequence_type():
    """
    Get count of scans grouped by sequence type (T1W, T2W, DWI, etc.).
    
    Returns:
        list: List of dicts with 'label' and 'value' keys
    """
    results = MRIScan.objects.values('sequence_type').annotate(
        count=Count('id')
    ).order_by('-count')
    
    return [
        {'label': item['sequence_type'], 'value': item['count']}
        for item in results
    ]


def get_metrics_histogram_dice(bins=5):
    """
    Get histogram of Dice scores from successful segmentation results.
    
    Args:
        bins: Number of bins (default 5 for ranges: 0-0.2, 0.2-0.4, ..., 0.8-1.0)
    
    Returns:
        list: List of dicts with 'label' and 'value' keys
    """
    # Get all Dice metrics from successful runs
    dice_metrics = Metric.objects.filter(
        metric_name='dice',
        segmentation_result__pipeline_run__status='COMPLETED'
    ).values_list('metric_value', flat=True)
    
    # Create bins
    bin_size = 1.0 / bins
    histogram = []
    
    for i in range(bins):
        lower = i * bin_size
        upper = (i + 1) * bin_size
        count = sum(1 for value in dice_metrics if lower <= value < upper or (i == bins - 1 and value == 1.0))
        
        label = f"{lower:.1f}–{upper:.1f}"
        histogram.append({'label': label, 'value': count})
    
    return histogram


def get_metrics_histogram_iou(bins=5):
    """
    Get histogram of IoU scores from successful segmentation results.
    
    Args:
        bins: Number of bins (default 5)
    
    Returns:
        list: List of dicts with 'label' and 'value' keys
    """
    # Get all IoU metrics from successful runs
    iou_metrics = Metric.objects.filter(
        metric_name='iou',
        segmentation_result__pipeline_run__status='COMPLETED'
    ).values_list('metric_value', flat=True)
    
    # Create bins
    bin_size = 1.0 / bins
    histogram = []
    
    for i in range(bins):
        lower = i * bin_size
        upper = (i + 1) * bin_size
        count = sum(1 for value in iou_metrics if lower <= value < upper or (i == bins - 1 and value == 1.0))
        
        label = f"{lower:.1f}–{upper:.1f}"
        histogram.append({'label': label, 'value': count})
    
    return histogram


def get_avg_dice_by_model():
    """
    Get average Dice score grouped by model version.
    
    Returns:
        list: List of dicts with 'label' (model name) and 'value' (avg dice)
    """
    results = Metric.objects.filter(
        metric_name='dice',
        segmentation_result__pipeline_run__status='COMPLETED',
        segmentation_result__pipeline_run__model_version__isnull=False
    ).values(
        'segmentation_result__pipeline_run__model_version__name'
    ).annotate(
        avg_dice=Avg('metric_value')
    ).order_by('-avg_dice')
    
    return [
        {
            'label': item['segmentation_result__pipeline_run__model_version__name'],
            'value': round(item['avg_dice'], 3)
        }
        for item in results
    ]


def get_avg_dice_by_config():
    """
    Get average Dice score grouped by experiment config.
    
    Returns:
        list: List of dicts with 'label' (config name) and 'value' (avg dice)
    """
    results = Metric.objects.filter(
        metric_name='dice',
        segmentation_result__pipeline_run__status='COMPLETED',
        segmentation_result__pipeline_run__experiment_config__isnull=False
    ).values(
        'segmentation_result__pipeline_run__experiment_config__name'
    ).annotate(
        avg_dice=Avg('metric_value')
    ).order_by('-avg_dice')
    
    return [
        {
            'label': item['segmentation_result__pipeline_run__experiment_config__name'],
            'value': round(item['avg_dice'], 3)
        }
        for item in results
    ]


def get_recent_activity(days=7, limit=10):
    """
    Get recent pipeline runs and their status.
    
    Args:
        days: Number of days to look back
        limit: Maximum number of runs to return
    
    Returns:
        list: List of recent run summaries
    """
    cutoff_date = timezone.now() - timedelta(days=days)
    
    recent_runs = PipelineRun.objects.filter(
        created_at__gte=cutoff_date
    ).select_related(
        'mri_scan', 'mri_scan__organoid', 'model_version'
    ).order_by('-created_at')[:limit]
    
    return [
        {
            'id': str(run.id),
            'organoid_name': run.mri_scan.organoid.name,
            'stage': run.stage,
            'status': run.status,
            'model': run.model_version.name if run.model_version else None,
            'created_at': run.created_at.isoformat(),
        }
        for run in recent_runs
    ]
