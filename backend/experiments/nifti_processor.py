"""
NIfTI Processing Module
Handles loading, processing, and preview generation for NIfTI MRI files.
"""
import os
import logging
import numpy as np
import nibabel as nib
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
from PIL import Image
from typing import Tuple, Optional

logger = logging.getLogger(__name__)


class NIfTIProcessor:
    """
    Process NIfTI files and generate preview images.
    """
    
    @staticmethod
    def load_nifti(file_path: str) -> Tuple[np.ndarray, nib.Nifti1Image]:
        """
        Load NIfTI file and return data array and image object.
        
        Args:
            file_path: Path to NIfTI file
            
        Returns:
            Tuple of (data array, nifti image object)
        """
        try:
            img = nib.load(file_path)
            data = img.get_fdata()
            return data, img
        except Exception as e:
            logger.error(f"Error loading NIfTI file {file_path}: {str(e)}")
            raise
    
    @staticmethod
    def normalize_intensity(data: np.ndarray, percentile_min: float = 2, percentile_max: float = 98) -> np.ndarray:
        """
        Normalize intensity values to 0-255 range using percentile clipping.
        
        Args:
            data: Input data array
            percentile_min: Lower percentile for clipping
            percentile_max: Upper percentile for clipping
            
        Returns:
            Normalized data array (0-255)
        """
        # Remove NaN and Inf values
        data = np.nan_to_num(data, nan=0.0, posinf=0.0, neginf=0.0)
        
        # Clip to percentiles to handle outliers
        p_min = np.percentile(data, percentile_min)
        p_max = np.percentile(data, percentile_max)
        
        # Clip and normalize
        data_clipped = np.clip(data, p_min, p_max)
        
        if p_max > p_min:
            data_normalized = ((data_clipped - p_min) / (p_max - p_min) * 255).astype(np.uint8)
        else:
            data_normalized = np.zeros_like(data_clipped, dtype=np.uint8)
        
        return data_normalized
    
    @staticmethod
    def extract_middle_slice(data: np.ndarray, orientation: str = 'axial') -> np.ndarray:
        """
        Extract middle slice from 3D/4D data.
        
        Args:
            data: 3D or 4D numpy array
            orientation: 'axial', 'sagittal', or 'coronal'
            
        Returns:
            2D slice array
        """
        # Handle 4D data (take first volume)
        if data.ndim == 4:
            data = data[:, :, :, 0]
        
        # Get middle slice based on orientation
        if orientation == 'axial':
            # Top-down view (z-axis)
            slice_idx = data.shape[2] // 2
            slice_data = data[:, :, slice_idx]
        elif orientation == 'sagittal':
            # Side view (x-axis)
            slice_idx = data.shape[0] // 2
            slice_data = data[slice_idx, :, :]
        elif orientation == 'coronal':
            # Front view (y-axis)
            slice_idx = data.shape[1] // 2
            slice_data = data[:, slice_idx, :]
        else:
            raise ValueError(f"Unknown orientation: {orientation}")
        
        return slice_data
    
    @staticmethod
    def generate_preview_image(
        data: np.ndarray,
        output_path: str,
        orientation: str = 'axial',
        dpi: int = 100,
        figsize: Tuple[int, int] = (5, 5)
    ) -> bool:
        """
        Generate and save preview image from 3D data.
        
        Args:
            data: 3D numpy array
            output_path: Path to save preview image
            orientation: View orientation
            dpi: Image resolution
            figsize: Figure size in inches
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Extract middle slice
            slice_data = NIfTIProcessor.extract_middle_slice(data, orientation)
            
            # Normalize intensity
            slice_normalized = NIfTIProcessor.normalize_intensity(slice_data)
            
            # Rotate for proper orientation
            slice_display = np.rot90(slice_normalized)
            
            # Create figure
            fig, ax = plt.subplots(figsize=figsize, dpi=dpi)
            ax.imshow(slice_display, cmap='gray', aspect='auto')
            ax.axis('off')
            
            # Remove margins
            plt.tight_layout(pad=0)
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Save image
            plt.savefig(output_path, bbox_inches='tight', pad_inches=0, dpi=dpi)
            plt.close(fig)
            
            logger.info(f"Preview image saved to {output_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error generating preview image: {str(e)}")
            return False
    
    @staticmethod
    def generate_axial_preview(file_path: str, output_path: str) -> bool:
        """
        Quick method to generate axial preview from NIfTI file.
        
        Args:
            file_path: Path to NIfTI file
            output_path: Path to save preview PNG
            
        Returns:
            True if successful, False otherwise
        """
        try:
            # Load NIfTI file
            data, img = NIfTIProcessor.load_nifti(file_path)
            
            # Generate preview
            success = NIfTIProcessor.generate_preview_image(
                data,
                output_path,
                orientation='axial',
                dpi=100,
                figsize=(6, 6)
            )
            
            return success
            
        except Exception as e:
            logger.error(f"Error in generate_axial_preview: {str(e)}")
            return False
    
    @staticmethod
    def get_slice_info(data: np.ndarray) -> dict:
        """
        Get information about data dimensions and slice counts.
        
        Args:
            data: NIfTI data array
            
        Returns:
            Dictionary with dimension info
        """
        if data.ndim == 4:
            return {
                'dimensions': '4D',
                'shape': data.shape,
                'axial_slices': data.shape[2],
                'sagittal_slices': data.shape[0],
                'coronal_slices': data.shape[1],
                'time_points': data.shape[3]
            }
        else:
            return {
                'dimensions': '3D',
                'shape': data.shape,
                'axial_slices': data.shape[2],
                'sagittal_slices': data.shape[0],
                'coronal_slices': data.shape[1]
            }
