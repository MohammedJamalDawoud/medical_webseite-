"""
Export utilities for generating CSV files from experiment data.
"""
import csv
from io import StringIO
from django.http import HttpResponse
from .models import Metric, ExperimentConfig, PipelineRun, SegmentationResult


def generate_csv_response(data, filename):
    """
    Generate HTTP response with CSV data
    
    Args:
        data: List of dictionaries containing data to export
        filename: Name for the downloaded file
        
    Returns:
        HttpResponse with CSV attachment
    """
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    if not data:
        return response
    
    writer = csv.DictWriter(response, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)
    
    return response


def export_metrics_csv():
    """
    Export all metrics to CSV format
    
    Returns:
        List of dictionaries with metric data
    """
    metrics = Metric.objects.select_related(
        'segmentation_result',
        'segmentation_result__pipeline_run',
        'segmentation_result__pipeline_run__experiment_config'
    ).all()
    
    data = []
    for metric in metrics:
        data.append({
            'id': metric.id,
            'metric_name': metric.metric_name,
            'metric_value': metric.metric_value,
            'experiment_config': metric.segmentation_result.pipeline_run.experiment_config.name if metric.segmentation_result and metric.segmentation_result.pipeline_run else 'N/A',
            'pipeline_run_id': metric.segmentation_result.pipeline_run.id if metric.segmentation_result and metric.segmentation_result.pipeline_run else 'N/A',
            'created_at': metric.created_at.isoformat() if metric.created_at else '',
        })
    
    return data


def export_experiments_csv():
    """
    Export all experiment configurations to CSV format
    
    Returns:
        List of dictionaries with experiment data
    """
    experiments = ExperimentConfig.objects.select_related('model_version', 'created_by').all()
    
    data = []
    for exp in experiments:
        data.append({
            'id': exp.id,
            'name': exp.name,
            'description': exp.description,
            'model_version': exp.model_version.name if exp.model_version else 'N/A',
            'created_by': exp.created_by.username if exp.created_by else 'N/A',
            'created_at': exp.created_at.isoformat() if exp.created_at else '',
        })
    
    return data


def export_pipeline_runs_csv():
    """
    Export all pipeline runs to CSV format
    
    Returns:
        List of dictionaries with pipeline run data
    """
    runs = PipelineRun.objects.select_related(
        'mri_scan',
        'experiment_config',
        'model_version'
    ).all()
    
    data = []
    for run in runs:
        data.append({
            'id': run.id,
            'stage': run.stage,
            'status': run.status,
            'mri_scan_id': run.mri_scan.id if run.mri_scan else 'N/A',
            'experiment_config': run.experiment_config.name if run.experiment_config else 'N/A',
            'model_version': run.model_version.name if run.model_version else 'N/A',
            'started_at': run.started_at.isoformat() if run.started_at else '',
            'finished_at': run.finished_at.isoformat() if run.finished_at else '',
            'created_at': run.created_at.isoformat() if run.created_at else '',
        })
    
    return data


def export_analytics_summary_csv():
    """
    Export analytics summary data to CSV format
    
    Returns:
        List of dictionaries with analytics summary data
    """
    from . import analytics
    
    overview = analytics.get_overview_counts()
    
    data = [
        {'metric': 'Total Organoids', 'value': overview.get('organoids', 0)},
        {'metric': 'Total MRI Scans', 'value': overview.get('scans', 0)},
        {'metric': 'Total Pipeline Runs', 'value': overview.get('runs', 0)},
        {'metric': 'Total Segmentation Results', 'value': overview.get('results', 0)},
        {'metric': 'Total Metrics', 'value': overview.get('metrics', 0)},
        {'metric': 'Total Experiment Configs', 'value': overview.get('experiments', 0)},
    ]
    
    return data
