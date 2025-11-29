"""
File upload utilities for NIfTI MRI scans.
Handles file validation, storage, and metadata extraction.
"""
import os
import hashlib
import logging
from typing import Optional, Dict, Any
from django.core.files.uploadedfile import UploadedFile
from django.conf import settings

logger = logging.getLogger(__name__)

# Allowed file extensions
ALLOWED_EXTENSIONS = ['.nii', '.nii.gz']

# Maximum file size (500 MB)
MAX_FILE_SIZE = 500 * 1024 * 1024


class FileUploadValidator:
    """Validates uploaded NIfTI files."""
    
    @staticmethod
    def validate_extension(filename: str) -> bool:
        """Check if file has valid NIfTI extension."""
        return any(filename.lower().endswith(ext) for ext in ALLOWED_EXTENSIONS)
    
    @staticmethod
    def validate_size(file_size: int) -> bool:
        """Check if file size is within limits."""
        return file_size <= MAX_FILE_SIZE
    
    @staticmethod
    def calculate_hash(file: UploadedFile) -> str:
        """Calculate SHA-256 hash of uploaded file."""
        sha256 = hashlib.sha256()
        
        # Read file in chunks to handle large files
        for chunk in file.chunks():
            sha256.update(chunk)
        
        # Reset file pointer
        file.seek(0)
        
        return sha256.hexdigest()
    
    @staticmethod
    def validate_nifti_format(file_path: str) -> tuple[bool, Optional[str]]:
        """
        Validate that file is a valid NIfTI file.
        
        Returns:
            tuple: (is_valid, error_message)
        """
        try:
            import nibabel as nib
            
            # Try to load the file
            img = nib.load(file_path)
            
            # Check if data can be accessed
            _ = img.shape
            
            return True, None
            
        except Exception as e:
            logger.error(f"NIfTI validation failed: {str(e)}")
            return False, f"Invalid NIfTI file: {str(e)}"


class NIfTIMetadataExtractor:
    """Extracts metadata from NIfTI files."""
    
    @staticmethod
    def extract_metadata(file_path: str) -> Dict[str, Any]:
        """
        Extract metadata from NIfTI file.
        
        Returns:
            dict: Metadata including dimensions, voxel size, etc.
        """
        try:
            import nibabel as nib
            import numpy as np
            
            img = nib.load(file_path)
            header = img.header
            
            metadata = {
                'dimensions': img.shape,
                'voxel_size': header.get_zooms()[:3] if hasattr(header, 'get_zooms') else None,
                'data_type': str(img.get_data_dtype()),
                'orientation': nib.aff2axcodes(img.affine) if hasattr(img, 'affine') else None,
                'file_format': img.__class__.__name__,
            }
            
            # Add intensity statistics
            data = img.get_fdata()
            metadata['intensity_stats'] = {
                'min': float(np.min(data)),
                'max': float(np.max(data)),
                'mean': float(np.mean(data)),
                'std': float(np.std(data)),
            }
            
            return metadata
            
        except Exception as e:
            logger.error(f"Metadata extraction failed: {str(e)}")
            return {}
