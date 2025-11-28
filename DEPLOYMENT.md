# Deployment Guide

This guide covers how to deploy the Medical Website application using Docker or manual methods.

## Prerequisites
- Docker & Docker Compose (for containerized deployment)
- Node.js 18+ & Python 3.11+ (for manual deployment)
- PostgreSQL (optional, for production database)

## Option 1: Docker Deployment (Recommended)

This is the easiest way to run the application, as it sets up the frontend, backend, and networking automatically.

1.  **Build and Start Containers**:
    ```bash
    docker-compose up --build
    ```
    This will start:
    - Backend API at `http://localhost:8000`
    - Frontend (Nginx) at `http://localhost:5173` (mapped to port 5173 in compose)

2.  **Stop Containers**:
    ```bash
    docker-compose down
    ```

## Option 2: Manual Deployment

### Backend (Django)

1.  **Navigate to backend**:
    ```bash
    cd backend
    ```

2.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Set Environment Variables**:
    Create a `.env` file with:
    ```
    DEBUG=False
    SECRET_KEY=your-production-secret-key
    ALLOWED_HOSTS=your-domain.com
    ```

4.  **Run Migrations**:
    ```bash
    python manage.py migrate
    ```

5.  **Collect Static Files**:
    ```bash
    python manage.py collectstatic
    ```

6.  **Run with Gunicorn** (Production):
    ```bash
    gunicorn core.wsgi:application --bind 0.0.0.0:8000
    ```

### Frontend (React + Vite)

1.  **Navigate to frontend**:
    ```bash
    cd frontend
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```
    This creates a `dist` folder.

4.  **Serve with Nginx/Apache**:
    Point your web server to the `dist` folder. Ensure you handle SPA routing (redirect 404s to `index.html`).

## CI/CD

A GitHub Actions workflow is included in `.github/workflows/ci.yml`. It runs on every push to `main` and performs:
- Linting (ESLint)
- Testing (Vitest)
- Building (Vite Build)

## Running the Pipeline via CLI

The application can be used as a CLI tool to process MRI scans headlessly:

### Process Pending Pipeline Runs

```bash
# Using Docker Compose
docker compose run backend python manage.py run_pipeline_jobs

# Process specific run by ID
docker compose run backend python manage.py run_pipeline_jobs --run-id <uuid>

# Limit number of runs to process
docker compose run backend python manage.py run_pipeline_jobs --limit 5
```

### Workflow

1. Create pipeline runs via API (status=PENDING)
2. Run the management command to process them
3. Check results via API

This allows the application to be integrated into automated workflows, cron jobs, or batch processing systems.

## API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/api/docs/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

## Production Considerations

- **Database**: Use a robust database like PostgreSQL instead of SQLite. Update `DATABASES` in `settings.py`.
- **Security**: Ensure `DEBUG=False` and use a strong `SECRET_KEY`.
- **HTTPS**: Use SSL/TLS certificates (e.g., via Let's Encrypt) for your domain.
- **CORS**: Update `CORS_ALLOWED_ORIGINS` in `settings.py` to match your frontend domain.
