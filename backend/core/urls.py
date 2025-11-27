from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import health_check, ContactMessageViewSet, FAQViewSet

router = DefaultRouter()
router.register(r'contact', ContactMessageViewSet)
router.register(r'faqs', FAQViewSet)

urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('', include(router.urls)),
]
