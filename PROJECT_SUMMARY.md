# MRI Organoids Segmentation Web Application

**A Combined GMM and U-Net Pipeline for Multimodal Tissue Segmentation of In Vitro MRI Data**

Master's Thesis Project | HAWK Göttingen & DPZ | 2025

---

## 🎓 Project Overview

This web application provides a comprehensive platform for managing brain organoid MRI data, executing automated segmentation pipelines, and analyzing results. It combines classical statistical methods (Gaussian Mixture Models) with modern deep learning (U-Net) for precise tissue segmentation.

**Student:** Mohammed Jamal Dawoud  
**Supervisors:**
- Prof. Dr. Roman Grothausmann (HAWK Göttingen)
- Prof. Dr. Susann Boretius (Deutsches Primatenzentrum)

---

## ✨ Key Features

### Data Management
- ✅ Organoid sample tracking with species classification
- ✅ MRI scan management (T1w, T2w, DWI, MGE sequences)
- ✅ Multi-dataset support (IN_VITRO, EX_VIVO, IN_VIVO)
- ✅ Dataset role assignment (TRAIN, VAL, TEST)
- ✅ Experiment configuration management
- ✅ Model version tracking

### Pipeline Execution
- ✅ Dual-mode operation (Simulation for development, Real for production)
- ✅ Full pipeline: Preprocessing → GMM → U-Net
- ✅ Individual stage execution
- ✅ Real-time status monitoring
- ✅ CLI support for batch processing

### Results & Analysis
- ✅ Quantitative metrics (Dice Score, IoU, Volume)
- ✅ Multi-view preview images (axial, sagittal, coronal)
- ✅ Interactive image gallery with zoom
- ✅ Side-by-side run comparison
- ✅ Quality control workflow with status tracking

### API & Integration
- ✅ RESTful API with comprehensive filtering
- ✅ OpenAPI/Swagger documentation
- ✅ Batch processing Python script
- ✅ Pagination and search support

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd medical_webseite-

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser

# Frontend setup
cd ../frontend
npm install
```

### Running the Application

```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173/
- Backend API: http://localhost:8000/api/
- API Documentation: http://localhost:8000/api/docs/

---

## 📁 Project Structure

```
medical_webseite-/
├── backend/
│   ├── experiments/           # Main Django app
│   │   ├── models.py         # Domain models
│   │   ├── serializers.py    # DRF serializers
│   │   ├── views.py          # API ViewSets
│   │   ├── pipeline.py       # Pipeline orchestration
│   │   └── tests/            # Backend tests
│   ├── API_DOCS.md           # API documentation
│   ├── examples/
│   │   └── batch_process_scans.py  # Batch processing script
│   └── manage.py
│
└── frontend/
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── pages/           # Page components
    │   ├── index.css        # Design system
    │   └── main.tsx         # Entry point
    └── package.json
```

---

## 🎨 Technology Stack

### Backend
- **Framework:** Django 4.x + Django REST Framework
- **Database:** SQLite (development) / PostgreSQL (production)
- **API Docs:** drf-spectacular (OpenAPI 3.0)
- **Testing:** Django TestCase

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Charts:** Recharts

---

## 📖 Documentation

- **[API Documentation](backend/API_DOCS.md)** - Complete API reference with examples
- **[Walkthrough](https://gemini-artifacts/)** - Detailed project walkthrough
- **[UI Redesign](https://gemini-artifacts/)** - UI/UX improvements documentation

---

## 🔬 Research Context

This application is designed to integrate with a scientific MRI segmentation pipeline developed as part of a Master's thesis. The pipeline combines:

1. **Preprocessing:** Bias field correction, denoising, intensity normalization
2. **GMM Segmentation:** Statistical tissue classification
3. **U-Net Refinement:** Deep learning-based segmentation improvement
4. **Evaluation:** Quantitative metrics against ground truth

### Integration Points

The application provides clear integration points for the scientific pipeline:

- **Pipeline Runner** (`backend/experiments/pipeline.py`) - Replace simulation stubs with actual pipeline calls
- **File Management** - Update file paths to point to real MRI data
- **Model Loading** - Integrate trained U-Net weights
- **Metrics Generation** - Compute real segmentation metrics

---

## 📊 API Endpoints

### Core Resources
- `GET/POST /api/organoids/` - Organoid samples
- `GET/POST /api/scans/` - MRI scans
- `GET/POST /api/pipeline-runs/` - Pipeline executions
- `GET /api/segmentation-results/` - Results and metrics

### Configuration
- `GET/POST /api/experiment-configs/` - Experiment configurations
- `GET/POST /api/model-versions/` - Model versions

### Filtering Examples
```bash
# Get training scans
GET /api/scans/?role=TRAIN

# Get in vitro scans
GET /api/scans/?data_type=IN_VITRO

# Get successful runs
GET /api/pipeline-runs/?status=SUCCESS

# Get accepted QC runs
GET /api/pipeline-runs/?qc_status=ACCEPTED
```

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

**Coverage:**
- Domain models and relationships
- API serializers and ViewSets
- Pipeline orchestration
- Management commands

### Frontend Build
```bash
cd frontend
npm run build
```

---

## 🔄 Batch Processing

Use the provided Python script for batch processing:

```bash
cd backend/examples
python batch_process_scans.py --config CONFIG_ID --model MODEL_ID --role TRAIN
```

**Features:**
- Process multiple scans automatically
- Real-time progress tracking
- Automatic QC marking (optional)
- Error handling and summary report

---

## 🎯 Development Phases

All 12 development phases completed:

1. ✅ **Foundation** - Django + React setup
2. ✅ **Domain Models** - Organoid, MRIScan, PipelineRun
3. ✅ **API Development** - RESTful endpoints
4. ✅ **Frontend Integration** - React pages and components
5. ✅ **Pipeline Orchestration** - Execution management
6. ✅ **Media Handling** - File storage and serving
7. ✅ **Pipeline Modes** - Simulation vs Real execution
8. ✅ **Experiment Tracking** - Configs and model versions
9. ✅ **Advanced Visualization** - Multi-view images, comparison
10. ✅ **Multi-Dataset Support** - Data types and roles
11. ✅ **QC Workflow** - Quality control tracking
12. ✅ **Documentation** - API docs and examples

**Bonus:** Complete UI/UX redesign with professional, research-grade interface

---

## 🌐 Deployment

### Development
Already running! See Quick Start above.

### Production Considerations
- Use PostgreSQL instead of SQLite
- Configure environment variables
- Set up proper CORS settings
- Implement authentication (JWT)
- Use production WSGI server (Gunicorn)
- Serve frontend via Nginx
- Set up monitoring and logging

---

## 📝 License

This project is part of a Master's thesis at HAWK Göttingen in collaboration with the Deutsches Primatenzentrum (DPZ).

---

## 🙏 Acknowledgments

- **HAWK Göttingen** - Primary academic institution
- **Deutsches Primatenzentrum (DPZ)** - Research collaboration and MRI data
- **Supervisors** - Prof. Dr. Roman Grothausmann and Prof. Dr. Susann Boretius

---

## 📧 Contact

For questions or collaboration inquiries, please contact through HAWK Göttingen or DPZ.

---

**Status:** ✅ All phases complete | Ready for Master's thesis presentation

**Last Updated:** November 2025
