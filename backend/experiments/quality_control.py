"""
Quality Control Module for MRI Segmentation Results

This module provides automated quality control functionality including:
- Statistical outlier detection (Z-score and IQR methods)
- Quality scoring algorithms
- Validation rules for segmentation metrics
- Automated QC assessment

For research use only - NOT for clinical diagnosis or patient treatment.
"""

import numpy as np
from typing import List, Dict, Tuple, Optional
import logging
from django.db.models import QuerySet

logger = logging.getLogger(__name__)

# QC Thresholds for different metrics
QC_THRESHOLDS = {
    'dice': {
        'excellent': 0.90,  # Dice >= 0.90
        'good': 0.80,       # Dice >= 0.80
        'fair': 0.70,       # Dice >= 0.70
        'poor': 0.0         # Dice < 0.70
    },
    'iou': {
        'excellent': 0.80,  # IoU >= 0.80
        'good': 0.70,       # IoU >= 0.70
        'fair': 0.60,       # IoU >= 0.60
        'poor': 0.0         # IoU < 0.60
    },
    'hausdorff': {
        'excellent': 5.0,   # Hausdorff < 5mm
        'good': 10.0,       # Hausdorff < 10mm
        'fair': 15.0,       # Hausdorff < 15mm
        'poor': float('inf')  # Hausdorff >= 15mm
    }
}


def calculate_z_score(value: float, mean: float, std: float) -> float:
    """
    Calculate z-score for a value.
    
    Args:
        value: The value to calculate z-score for
        mean: Mean of the distribution
        std: Standard deviation of the distribution
        
    Returns:
        Z-score (number of standard deviations from mean)
    """
    if std == 0:
        return 0.0
    return (value - mean) / std


def detect_outliers_zscore(values: List[float], threshold: float = 3.0) -> List[int]:
    """
    Detect outliers using z-score method.
    
    Values beyond threshold standard deviations from mean are considered outliers.
    Default threshold of 3.0 corresponds to 99.7% confidence in normal distribution.
    
    Args:
        values: List of numeric values
        threshold: Number of standard deviations to use as cutoff
        
    Returns:
        List of indices of outlier values
    """
    if len(values) < 3:  # Need at least 3 values for meaningful statistics
        return []
    
    values_array = np.array(values)
    mean = np.mean(values_array)
    std = np.std(values_array)
    
    if std == 0:  # All values are the same
        return []
    
    z_scores = np.abs((values_array - mean) / std)
    outliers = np.where(z_scores > threshold)[0].tolist()
    
    return outliers


def detect_outliers_iqr(values: List[float], multiplier: float = 1.5) -> List[int]:
    """
    Detect outliers using Interquartile Range (IQR) method.
    
    Values beyond Q1 - multiplier*IQR or Q3 + multiplier*IQR are outliers.
    This method is more robust to extreme values than z-score.
    
    Args:
        values: List of numeric values
        multiplier: IQR multiplier (1.5 for outliers, 3.0 for extreme outliers)
        
    Returns:
        List of indices of outlier values
    """
    if len(values) < 4:  # Need at least 4 values for quartiles
        return []
    
    values_array = np.array(values)
    q1 = np.percentile(values_array, 25)
    q3 = np.percentile(values_array, 75)
    iqr = q3 - q1
    
    if iqr == 0:  # No variation in middle 50%
        return []
    
    lower_bound = q1 - (multiplier * iqr)
    upper_bound = q3 + (multiplier * iqr)
    
    outliers = np.where((values_array < lower_bound) | (values_array > upper_bound))[0].tolist()
    
    return outliers


def calculate_dice_quality_score(dice: float) -> Tuple[str, int]:
    """
    Calculate quality rating for Dice coefficient.
    
    Args:
        dice: Dice coefficient value (0-1)
        
    Returns:
        Tuple of (quality_label, score_0_100)
    """
    if dice >= QC_THRESHOLDS['dice']['excellent']:
        return 'excellent', 95
    elif dice >= QC_THRESHOLDS['dice']['good']:
        return 'good', 85
    elif dice >= QC_THRESHOLDS['dice']['fair']:
        return 'fair', 70
    else:
        return 'poor', max(0, int(dice * 100))


def calculate_iou_quality_score(iou: float) -> Tuple[str, int]:
    """
    Calculate quality rating for IoU (Intersection over Union).
    
    Args:
        iou: IoU value (0-1)
        
    Returns:
        Tuple of (quality_label, score_0_100)
    """
    if iou >= QC_THRESHOLDS['iou']['excellent']:
        return 'excellent', 95
    elif iou >= QC_THRESHOLDS['iou']['good']:
        return 'good', 85
    elif iou >= QC_THRESHOLDS['iou']['fair']:
        return 'fair', 70
    else:
        return 'poor', max(0, int(iou * 100))


def calculate_overall_quality_score(metrics: Dict[str, float]) -> int:
    """
    Calculate overall quality score (0-100) from multiple metrics.
    
    Weighted scoring:
    - Dice coefficient: 50%
    - IoU: 30%
    - Hausdorff distance: 20%
    
    Args:
        metrics: Dictionary with 'dice', 'iou', and optionally 'hausdorff'
        
    Returns:
        Overall quality score (0-100)
    """
    # Dice score (0-100)
    dice = metrics.get('dice', 0)
    dice_score = min(dice * 100, 100)
    
    # IoU score (0-100)
    iou = metrics.get('iou', 0)
    iou_score = min(iou * 100, 100)
    
    # Hausdorff score (inverse - lower is better)
    hausdorff = metrics.get('hausdorff', 5.0)
    if hausdorff < QC_THRESHOLDS['hausdorff']['excellent']:
        hausdorff_score = 100
    elif hausdorff < QC_THRESHOLDS['hausdorff']['good']:
        hausdorff_score = 80
    elif hausdorff < QC_THRESHOLDS['hausdorff']['fair']:
        hausdorff_score = 60
    else:
        # Penalize heavily for poor Hausdorff
        hausdorff_score = max(0, 100 - (hausdorff - QC_THRESHOLDS['hausdorff']['fair']) * 5)
    
    # Weighted average
    overall = (dice_score * 0.5) + (iou_score * 0.3) + (hausdorff_score * 0.2)
    
    return int(round(overall))


def validate_dice_score(dice: float) -> Tuple[bool, str]:
    """
    Validate Dice coefficient and return pass/fail with message.
    
    Args:
        dice: Dice coefficient (0-1)
        
    Returns:
        Tuple of (is_valid, message)
    """
    quality, _ = calculate_dice_quality_score(dice)
    
    if quality == 'excellent':
        return True, f'Excellent Dice score ({dice:.3f})'
    elif quality == 'good':
        return True, f'Good Dice score ({dice:.3f})'
    elif quality == 'fair':
        return False, f'Fair Dice score ({dice:.3f}) - review recommended'
    else:
        return False, f'Poor Dice score ({dice:.3f}) - manual review required'


def validate_iou_score(iou: float) -> Tuple[bool, str]:
    """
    Validate IoU score and return pass/fail with message.
    
    Args:
        iou: IoU value (0-1)
        
    Returns:
        Tuple of (is_valid, message)
    """
    quality, _ = calculate_iou_quality_score(iou)
    
    if quality == 'excellent':
        return True, f'Excellent IoU ({iou:.3f})'
    elif quality == 'good':
        return True, f'Good IoU ({iou:.3f})'
    elif quality == 'fair':
        return False, f'Fair IoU ({iou:.3f}) - review recommended'
    else:
        return False, f'Poor IoU ({iou:.3f}) - manual review required'


def validate_volume(volume: float, expected_range: Optional[Tuple[float, float]] = None) -> Tuple[bool, str]:
    """
    Validate volume measurement.
    
    Args:
        volume: Volume in mm³
        expected_range: Optional (min, max) expected volume range
        
    Returns:
        Tuple of (is_valid, message)
    """
    if volume <= 0:
        return False, f'Invalid volume ({volume:.2f} mm³) - must be positive'
    
    if expected_range:
        min_vol, max_vol = expected_range
        if volume < min_vol or volume > max_vol:
            return False, f'Volume ({volume:.2f} mm³) outside expected range ({min_vol}-{max_vol} mm³)'
    
    return True, f'Volume within acceptable range ({volume:.2f} mm³)'


def assess_segmentation_quality(segmentation_result) -> Dict:
    """
    Assess overall quality of a segmentation result.
    
    Args:
        segmentation_result: SegmentationResult model instance
        
    Returns:
        Dictionary with QC assessment:
        {
            'status': 'pass'|'warning'|'fail',
            'score': 0-100,
            'flags': [list of issues],
            'metrics_assessment': {metric_name: (valid, message)}
        }
    """
    from experiments.models import Metric
    
    flags = []
    metrics_assessment = {}
    
    # Get metrics for this result
    metrics_qs = Metric.objects.filter(segmentation_result=segmentation_result)
    metrics_dict = {}
    
    for metric in metrics_qs:
        metric_name = metric.metric_name.lower()
        metrics_dict[metric_name] = metric.metric_value
    
    # Validate Dice if available
    if 'dice' in metrics_dict:
        is_valid, message = validate_dice_score(metrics_dict['dice'])
        metrics_assessment['dice'] = (is_valid, message)
        if not is_valid:
            flags.append(message)
    
    # Validate IoU if available
    if 'iou' in metrics_dict:
        is_valid, message = validate_iou_score(metrics_dict['iou'])
        metrics_assessment['iou'] = (is_valid, message)
        if not is_valid:
            flags.append(message)
    
    # Validate Volume if available
    if 'volume' in metrics_dict:
        is_valid, message = validate_volume(metrics_dict['volume'])
        metrics_assessment['volume'] = (is_valid, message)
        if not is_valid:
            flags.append(message)
    
    # Calculate overall quality score
    overall_score = calculate_overall_quality_score(metrics_dict)
    
    # Determine QC status
    if overall_score >= 85 and len(flags) == 0:
        status = 'pass'
    elif overall_score >= 70 or len(flags) <= 1:
        status = 'warning'
    else:
        status = 'fail'
    
    return {
        'status': status,
        'score': overall_score,
        'flags': flags,
        'metrics_assessment': metrics_assessment
    }


def detect_metric_outliers(metric_name: str, method: str = 'iqr') -> Dict:
    """
    Detect outliers for a specific metric across all results.
    
    Args:
        metric_name: Name of metric to analyze ('Dice', 'IoU', etc.)
        method: 'zscore' or 'iqr'
        
    Returns:
        Dictionary with outlier information
    """
    from experiments.models import Metric
    
    # Get all values for this metric
    metrics = Metric.objects.filter(metric_name=metric_name).values_list('id', 'metric_value')
    
    if len(metrics) < 4:
        return {
            'outliers': [],
            'message': f'Not enough data points ({len(metrics)}) for outlier detection'
        }
    
    metric_ids = [m[0] for m in metrics]
    values = [m[1] for m in metrics]
    
    # Detect outliers
    if method == 'zscore':
        outlier_indices = detect_outliers_zscore(values)
    else:
        outlier_indices = detect_outliers_iqr(values)
    
    outlier_ids = [metric_ids[i] for i in outlier_indices]
    
    return {
        'outliers': outlier_ids,
        'outlier_count': len(outlier_ids),
        'total_count': len(values),
        'outlier_percentage': (len(outlier_ids) / len(values)) * 100 if values else 0,
        'method': method
    }
