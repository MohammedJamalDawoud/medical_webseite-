import requests
try:
    resp = requests.post('http://localhost:8000/api/auth/login/', json={'username': 'admin', 'password': 'admin123'})
    print(f"Status Code: {resp.status_code}")
    print(f"Response: {resp.text}")
except Exception as e:
    print(f"Error: {e}")
