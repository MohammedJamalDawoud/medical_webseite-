"""
File upload views for NIfTI MRI scans.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import MRIScan
from .upload_serializer import FileUploadSerializer
import logging

logger = logging.getLogger(__name__)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_scan_file(request, scan_id):
    """
    Upload a NIfTI file to an existing MRIScan.
    
    POST /api/scans/{scan_id}/upload/
    """
    scan = get_object_or_404(MRIScan, id=scan_id)
    
    # Check if file is in request
    if 'file' not in request.FILES:
        return Response(
            {'error': 'No file provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create serializer with file
    serializer = FileUploadSerializer(
        scan,
        data={'file_path': request.FILES['file']},
        partial=True
    )
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_scan_with_upload(request):
    """
    Create a new MRIScan and upload file in one request.
    
    POST /api/scans/upload/
    
    Required fields:
    - organoid: UUID of organoid
    - sequence_type: Sequence type
    - file: NIfTI file
    
    Optional fields:
    - acquisition_date
    - resolution
    - data_type
    - role
    - notes
    """
    # Check if file is in request
    if 'file' not in request.FILES:
        return Response(
            {'error': 'No file provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Prepare data
    data = request.data.copy()
    data['file_path'] = request.FILES['file']
    
    # Create serializer
    serializer = FileUploadSerializer(data=data)
    
    if serializer.is_valid():
        scan = serializer.save()
        return Response(
            FileUploadSerializer(scan).data,
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
