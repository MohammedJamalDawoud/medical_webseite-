import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mri_organoids.settings')
django.setup()

from django.contrib.auth.models import User

try:
    if User.objects.filter(username='admin').exists():
        print("User 'admin' already exists. Deleting...")
        User.objects.get(username='admin').delete()
    
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("Superuser 'admin' created successfully.")
except Exception as e:
    print(f"Error creating user: {e}")
