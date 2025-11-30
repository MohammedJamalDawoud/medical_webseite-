"""
WebSocket URL routing for experiments app.
"""

from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/pipeline-status/$', consumers.PipelineStatusConsumer.as_asgi()),
]
