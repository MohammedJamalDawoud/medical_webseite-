"""
File upload serializer for NIfTI MRI scans.
Handles file validation and metadata extraction during upload.
"""
from rest_framework import serializers
from .models import MRIScan
from .file_upload import FileUploadValidator, NIfTIMetadataExtractor
import logging

logger = logging.getLogger(__name__)


class FileUploadSerializer(serializers.ModelSerializer):
    """
    Serializer for uploading NIfTI files to MRIScan.
    Validates file format and extracts metadata.
    """
    
    class Meta:
        model = MRIScan
        fields = ['id', 'file_path', 'upload_status', 'upload_error', 'file_size', 'file_hash']
        read_only_fields = ['id', 'upload_status', 'upload_error', 'file_size', 'file_hash']
    
    def validate_file_path(self, value):
        """Validate uploaded NIfTI file."""
        # Check extension
        if not FileUploadValidator.validate_extension(value.name):
            raise serializers.ValidationError(
                "Invalid file format. Only .nii and .nii.gz files are supported."
            )
        
        # Check size
        if not FileUploadValidator.validate_size(value.size):
            raise serializers.ValidationError(
                f"File too large. Maximum size is {FileUploadValidator.MAX_FILE_SIZE / (1024*1024):.0f}MB."
            )
        
        return value
    
    def create(self, validated_data):
        """Create MRIScan with uploaded file."""
        file = validated_data.get('file_path')
        
        # Update status to uploading
        validated_data['upload_status'] = 'UPLOADING'
        
        # Calculate file hash
        try:
            file_hash = FileUploadValidator.calculate_hash(file)
            validated_data['file_hash'] = file_hash
            validated_data['file_size'] = file.size
        except Exception as e:
            logger.error(f"Error calculating file hash: {str(e)}")
        return scan
    
    def update(self, instance, validated_data):
        """Update MRIScan with new file."""
        file = validated_data.get('file_path')
        
        if file:
            # Update status
            instance.upload_status = 'UPLOADING'
            
            # Calculate hash
            try:
                file_hash = FileUploadValidator.calculate_hash(file)
                instance.file_hash = file_hash
                instance.file_size = file.size
            except Exception as e:
                logger.error(f"Error calculating file hash: {str(e)}")
                instance.upload_status = 'FAILED'
                instance.upload_error = f"Hash calculation failed: {str(e)}"
                instance.save()
                return instance
            
            # Update file
            instance.file_path = file
            instance.save()
            
            # Validate NIfTI format
            is_valid, error_msg = FileUploadValidator.validate_nifti_format(instance.file_path.path)
            
            if is_valid:
                instance.upload_status = 'UPLOADED'
                instance.upload_error = ''
            else:
                instance.upload_status = 'FAILED'
                instance.upload_error = error_msg
            
            instance.save()
        
        return instance
