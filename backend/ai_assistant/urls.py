"""
URL configuration for AI Assistant app.
"""

from django.urls import path
from . import views

app_name = 'ai_assistant'

urlpatterns = [
    path('ask-docs/', views.ask_docs, name='ask-docs'),
]
