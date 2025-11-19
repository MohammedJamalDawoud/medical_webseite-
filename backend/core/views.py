from django.http import JsonResponse
from rest_framework.decorators import api_view


@api_view(['GET'])
def health_check(request):
    """
    Simple health check endpoint for the MRI Organoids API.
    """
    return JsonResponse({
        'status': 'ok',
        'message': 'MRI Organoids API running'
    })
