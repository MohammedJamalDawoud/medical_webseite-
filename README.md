# MRI Organoids Segmentation Pipeline

# MRI Organoids Segmentation Pipeline

## Overview
This project is a full-stack web application developed for the Master's Thesis: **"A Combined GMM and U-Net Pipeline for Multimodal Tissue Segmentation of In Vitro MRI Data"**.

The application serves as a platform to visualize and manage MRI data of brain organoids, track processing pipelines, and display segmentation results.

## Features
- **Organoid Management**: Catalog and manage brain organoid samples (human, marmoset).
- **MRI Scan Tracking**: Store and organize multimodal MRI sequences (T1w, T2w, DWI, MGE).
- **Pipeline Orchestration**: Execute and monitor segmentation workflows (Preprocessing → GMM → U-Net).
- **Quantitative Metrics**: View Dice scores, IoU, and tissue volume measurements.
- **Results Visualization**: Interactive display of segmentation results and metrics.
- **Publications Repository**: Catalog of related scientific outputs.
- **RESTful API**: Comprehensive API with OpenAPI/Swagger documentation.
- **CLI Support**: Run pipeline jobs headlessly via Docker.
- **Enhanced UI/UX**:
  - Dark Mode support with persistent preference.
  - SEO optimization with meta tags and structured data.
  - Responsive design with glassmorphism aesthetics.
  - Real-time pipeline status monitoring.
  - Pagination and loading skeletons for better performance.

## Tech Stack
- **Backend**: Django 5.1, Django REST Framework, drf-spectacular (OpenAPI).
- **Frontend**: React 18 (TypeScript), Vite, Vanilla CSS with design system.
- **Database**: SQLite (dev), PostgreSQL (production).
- **DevOps**: Docker, Docker Compose, GitHub Actions CI/CD.
- **Testing**: Vitest (frontend), Django TestCase (backend).

## Getting Started

### Quick Start with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/medical_webseite-.git
cd medical_webseite-

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/api/docs/
```

### Manual Setup

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Linux/Mac
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Configure `SECRET_KEY` and `DEBUG` settings.
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure
- `/backend`: Django project and apps (`core`, `experiments`).
- `/frontend`: React application source code.
- `/docs`: Additional documentation (API, Design System).

## API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:8000/api/docs/
- **OpenAPI Schema**: http://localhost:8000/api/schema/
- **Full API Docs**: See `/docs/API_DOCS.md`

## For Masterabschluss / Future Work

### Research Context

This web application serves as the **front-end and orchestration layer** for the MRI organoid segmentation pipeline developed as part of the Master's thesis:

**"A Combined GMM and U-Net Pipeline for Multimodal Tissue Segmentation of In Vitro MRI Data"**

The application is designed as a **research prototype** to demonstrate how advanced segmentation models (GMM and U-Net) can be integrated into a practical, user-friendly tool for medical informatics workflows.

### Current Integration Points

The backend provides clear integration points for the scientific pipeline code:

1.  **Pipeline Runner** (`backend/experiments/pipeline_runner.py`):
    *   Orchestrates execution of preprocessing, GMM, and U-Net stages
    *   Designed to call external Python modules or CLI commands
    *   Currently contains simulation stubs with clear `TODO` markers

2.  **Management Command** (`backend/experiments/management/commands/run_pipeline_jobs.py`):
    *   Processes pending pipeline runs
    *   Can be invoked via Docker CLI for headless execution
    *   Suitable for integration with cron jobs or batch processing systems

3.  **Data Models**:
    *   `Organoid`: Sample metadata
    *   `MRIScan`: NIfTI file paths and acquisition parameters
    *   `PipelineRun`: Execution tracking with config JSON
    *   `SegmentationResult`: Output masks and preview images
    *   `Metric`: Quantitative evaluation (Dice, IoU, volume)

### Expected Future Integration

When the scientific pipeline is finalized, the integration would involve:

1.  **Real NIfTI Data Paths**:
    *   Update `MRIScan.file_path` to point to actual scanner data from the DPZ server
    *   Implement file upload endpoints if needed

2.  **U-Net Model Integration**:
    *   Replace simulation stubs in `pipeline_runner.py` with actual model inference
    *   Load trained U-Net weights and perform segmentation
    *   Generate real preview images (PNG slices)

3.  **Advanced Biomarker Computation**:
    *   Extend `Metric` model with additional quantitative measures
    *   Integrate volumetric analysis and tissue characterization
    *   Add visualization endpoints for 3D rendering

4.  **Performance Optimization**:
    *   Implement background job queue (Celery/RQ) for long-running pipelines
    *   Add WebSocket support for real-time progress updates
    *   Optimize database queries for large datasets

### Academic Disclaimer

**This is a research prototype, not intended for clinical use.**

The application demonstrates the feasibility of integrating machine learning-based segmentation into a web-based medical informatics platform. All results should be validated against ground truth and reviewed by domain experts before any research conclusions are drawn.

### Citation

If you use this work in your research, please cite:

```
[Author Name]. (2024). A Combined GMM and U-Net Pipeline for Multimodal Tissue 
Segmentation of In Vitro MRI Data. Master's Thesis, [University Name].
```

## License
[License Information]
