# MRI Organoids Segmentation API Documentation

## Base URL
```
http://localhost:8000/api/
```

## Authentication
Currently, the API does not require authentication. In production, implement token-based authentication.

---

## Endpoints

### 1. Organoids

#### List Organoids
```http
GET /api/organoids/
```

**Query Parameters:**
- `species` (optional): Filter by species (HUMAN, MARMOSET, OTHER)

**Response:**
```json
{
  "results": [
    {
      "id": "uuid",
      "name": "Organoid-001",
      "species": "HUMAN",
      "experiment_id": "EXP-2025-001",
      "description": "Human cortical organoid",
      "created_at": "2025-01-15T10:30:00Z",
      "scans_count": 5,
      "notes": ""
    }
  ]
}
```

#### Create Organoid
```http
POST /api/organoids/
```

**Request Body:**
```json
{
  "name": "Organoid-002",
  "species": "HUMAN",
  "experiment_id": "EXP-2025-001",
  "description": "Human cortical organoid, day 30",
  "notes": "Grown under standard conditions"
}
```

#### Get Organoid Detail
```http
GET /api/organoids/{id}/
```

#### Update Organoid
```http
PUT /api/organoids/{id}/
PATCH /api/organoids/{id}/
```

#### Delete Organoid
```http
DELETE /api/organoids/{id}/
```

---

### 2. MRI Scans

#### List Scans
```http
GET /api/scans/
```

**Query Parameters:**
- `organoid` (optional): Filter by organoid UUID
- `sequence_type` (optional): Filter by sequence (T1W, T2W, DWI, MGE)
- `data_type` (optional): Filter by data type (IN_VITRO, EX_VIVO, IN_VIVO)
- `role` (optional): Filter by role (TRAIN, VAL, TEST, UNASSIGNED)

**Response:**
```json
{
  "results": [
    {
      "id": "uuid",
      "organoid": "organoid-uuid",
      "organoid_name": "Organoid-001",
      "sequence_type": "T1W",
      "data_type": "IN_VITRO",
      "role": "TRAIN",
      "acquisition_date": "2025-01-20",
      "resolution": "100 μm isotropic",
      "file_path": "/data/scans/scan001.nii.gz",
      "notes": "",
      "created_at": "2025-01-20T14:00:00Z",
      "pipeline_runs_count": 3
    }
  ]
}
```

#### Create Scan
```http
POST /api/scans/
```

**Request Body:**
```json
{
  "organoid": "organoid-uuid",
  "sequence_type": "T1W",
  "data_type": "IN_VITRO",
  "role": "TRAIN",
  "acquisition_date": "2025-01-20",
  "resolution": "100 μm isotropic",
  "file_path": "/data/scans/scan001.nii.gz",
  "notes": "High quality scan"
}
```

---

### 3. Experiment Configurations

#### List Experiment Configs
```http
GET /api/experiment-configs/
```

**Response:**
```json
{
  "results": [
    {
      "id": "uuid",
      "name": "Standard GMM-UNet",
      "description": "Default configuration for GMM + U-Net pipeline",
      "config_json": {
        "gmm_classes": 3,
        "unet_depth": 4,
        "learning_rate": 0.001
      },
      "created_at": "2025-01-10T09:00:00Z"
    }
  ]
}
```

#### Create Experiment Config
```http
POST /api/experiment-configs/
```

**Request Body:**
```json
{
  "name": "High Resolution Config",
  "description": "Configuration for high-resolution scans",
  "config_json": {
    "gmm_classes": 5,
    "unet_depth": 5,
    "learning_rate": 0.0005,
    "batch_size": 2
  }
}
```

---

### 4. Model Versions

#### List Model Versions
```http
GET /api/model-versions/
```

**Response:**
```json
{
  "results": [
    {
      "id": "uuid",
      "name": "UNet-v1.0",
      "description": "Initial U-Net model trained on 50 samples",
      "weights_path": "/models/unet_v1.0.pth",
      "created_at": "2025-01-05T12:00:00Z"
    }
  ]
}
```

#### Create Model Version
```http
POST /api/model-versions/
```

**Request Body:**
```json
{
  "name": "UNet-v1.1",
  "description": "Improved model with data augmentation",
  "weights_path": "/models/unet_v1.1.pth"
}
```

---

### 5. Pipeline Runs

#### List Pipeline Runs
```http
GET /api/pipeline-runs/
```

**Query Parameters:**
- `mri_scan` (optional): Filter by scan UUID
- `status` (optional): Filter by status (PENDING, RUNNING, SUCCESS, FAILED)
- `experiment_config` (optional): Filter by config UUID
- `model_version` (optional): Filter by model UUID
- `qc_status` (optional): Filter by QC status (NOT_REVIEWED, ACCEPTED, REJECTED)

**Response:**
```json
{
  "results": [
    {
      "id": "uuid",
      "mri_scan": "scan-uuid",
      "scan_info": {
        "id": "scan-uuid",
        "organoid_name": "Organoid-001",
        "sequence_type": "T1W"
      },
      "stage": "FULL_PIPELINE",
      "status": "SUCCESS",
      "qc_status": "ACCEPTED",
      "qc_notes": "Good segmentation quality",
      "started_at": "2025-01-21T10:00:00Z",
      "finished_at": "2025-01-21T10:15:00Z",
      "log_excerpt": "Pipeline completed successfully",
      "config_json": {},
      "experiment_config": "config-uuid",
      "experiment_config_name": "Standard GMM-UNet",
      "model_version": "model-uuid",
      "model_version_name": "UNet-v1.0",
      "docker_image": "mri-pipeline:latest",
      "cli_command": "python run_pipeline.py --input scan001.nii.gz",
      "created_at": "2025-01-21T09:55:00Z",
      "has_result": true
    }
  ]
}
```

#### Create Pipeline Run
```http
POST /api/pipeline-runs/
```

**Request Body:**
```json
{
  "mri_scan": "scan-uuid",
  "stage": "FULL_PIPELINE",
  "config_json": {
    "preprocessing": {
      "denoise": true,
      "bias_correction": true
    }
  },
  "experiment_config": "config-uuid",
  "model_version": "model-uuid"
}
```

#### Update QC Status
```http
PATCH /api/pipeline-runs/{id}/
```

**Request Body:**
```json
{
  "qc_status": "ACCEPTED",
  "qc_notes": "Excellent segmentation, all tissue classes clearly defined"
}
```

---

### 6. Segmentation Results

#### List Segmentation Results
```http
GET /api/segmentation-results/
```

**Query Parameters:**
- `pipeline_run` (optional): Filter by pipeline run UUID

**Response:**
```json
{
  "results": [
    {
      "id": "uuid",
      "pipeline_run": "run-uuid",
      "dice_score": 0.92,
      "iou": 0.85,
      "volume_ml": 2.5,
      "preview_images": {
        "axial": "data:image/svg+xml;base64,...",
        "sagittal": "data:image/svg+xml;base64,...",
        "coronal": "data:image/svg+xml;base64,..."
      },
      "created_at": "2025-01-21T10:15:00Z"
    }
  ]
}
```

---

## Common Workflows

### 1. Create New Organoid and Scan
```python
# 1. Create organoid
organoid = POST /api/organoids/
{
  "name": "Organoid-003",
  "species": "HUMAN",
  "experiment_id": "EXP-2025-002"
}

# 2. Add MRI scan
scan = POST /api/scans/
{
  "organoid": organoid["id"],
  "sequence_type": "T1W",
  "data_type": "IN_VITRO",
  "role": "TRAIN",
  "file_path": "/data/scan003.nii.gz"
}
```

### 2. Run Pipeline and Review Results
```python
# 1. Start pipeline run
run = POST /api/pipeline-runs/
{
  "mri_scan": scan["id"],
  "stage": "FULL_PIPELINE",
  "experiment_config": config_id,
  "model_version": model_id
}

# 2. Check status
status = GET /api/pipeline-runs/{run["id"]}/

# 3. Get results
results = GET /api/segmentation-results/?pipeline_run={run["id"]}

# 4. Perform QC
PATCH /api/pipeline-runs/{run["id"]}/
{
  "qc_status": "ACCEPTED",
  "qc_notes": "Good quality"
}
```

### 3. Batch Processing
```python
# Get all training scans
scans = GET /api/scans/?role=TRAIN

# Process each scan
for scan in scans:
    run = POST /api/pipeline-runs/
    {
      "mri_scan": scan["id"],
      "stage": "FULL_PIPELINE",
      "experiment_config": config_id
    }
```

---

## Error Responses

### 400 Bad Request
```json
{
  "field_name": ["Error message"]
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- UUIDs are used for all resource identifiers
- File paths should be absolute paths accessible by the backend
- In SIMULATION mode, pipeline runs complete immediately with dummy data
- In REAL mode, actual CLI commands are executed (requires proper setup)

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production.

## Pagination

List endpoints support pagination:
- `?page=1` - Page number
- `?page_size=10` - Items per page (default: varies by endpoint)

## Filtering

Most list endpoints support filtering via query parameters. See individual endpoint documentation for available filters.
