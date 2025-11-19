# MRI Organoids Segmentation Pipeline

## Overview
This project is a full-stack web application developed for the Master's Thesis: **"A Combined GMM and U-Net Pipeline for Multimodal Tissue Segmentation of In Vitro MRI Data"**.

The application serves as a platform to visualize and manage MRI data of brain organoids, track processing pipelines, and display segmentation results.

## Features
- **Organoid Management**: Catalog of human and marmoset brain organoids.
- **MRI Scans**: Detailed view of acquired MRI sequences (T1w, T2w, DWI, MGE).
- **Processing Pipeline**: Visualization of the automated segmentation workflow (Preprocessing -> GMM -> U-Net).
- **Results**: Interactive display of segmentation metrics (Dice Score, Jaccard Index).
- **Publications**: Repository of related scientific outputs.

## Tech Stack
- **Backend**: Django (Python), Django REST Framework, SQLite/PostgreSQL.
- **Frontend**: React (TypeScript), Vite, Tailwind CSS, Axios, Recharts/Lucide.

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+

### Backend Setup
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
5. Run migrations and seed data:
   ```bash
   python manage.py migrate
   python manage.py load_sample_data
   ```
6. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
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
- `/docs`: Additional documentation.

## License
[License Information]
