# API Documentation

This document provides comprehensive information about the MRI Organoids Segmentation API.

## Base URL

```
http://localhost:8000/api/
```

## Interactive Documentation

- **Swagger UI**: http://localhost:8000/api/docs/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

## Authentication

Currently, all endpoints are publicly accessible (AllowAny). In production, implement proper authentication.

## Endpoints

### Organoids

#### List Organoids
```
GET /api/organoids/
```
Query Parameters:
- `species` (optional): Filter by species (HUMAN, MARMOSET, OTHER)
- `search` (optional): Search by name or experiment_id
- `ordering` (optional): Sort by created_at, name

Response:
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "name": "Organoid 1",
      "species": "HUMAN",
      "experiment_id": "EXP001",
      "description": "Description",
      "created_at": "2024-01-01T00:00:00Z",
      "notes": "",
      "scans_count": 3
    }
  ]
}
```

#### Create Organoid
```
POST /api/organoids/
```
Body:
```json
{
  "name": "New Organoid",
  "species": "MARMOSET",
  "experiment_id": "EXP002",
  "description": "Brain organoid sample"
}
```

#### Get Organoid
```
GET /api/organoids/{id}/
```

#### Update Organoid
```
PUT /api/organoids/{id}/
PATCH /api/organoids/{id}/
```

#### Delete Organoid
```
DELETE /api/organoids/{id}/
```

---

### MRI Scans

#### List Scans
```
GET /api/scans/
```
Query Parameters:
- `organoid` (required): Filter by organoid UUID
- `sequence_type` (optional): Filter by sequence type
- `search` (optional): Search in file_path, notes

Response:
```json
{
  "results": [
    {
      "id": "uuid",
      "organoid": "organoid-uuid",
      "organoid_name": "Organoid 1",
      "sequence_type": "T1W",
      "acquisition_date": "2024-01-15",
      "resolution": "100 μm isotropic",
      "file_path": "/data/scans/scan001.nii.gz",
      "notes": "",
      "created_at": "2024-01-01T00:00:00Z",
      "pipeline_runs_count": 2
    }
  ]
}
```

#### Create Scan
```
POST /api/scans/
```
Body:
```json
{
  "organoid": "organoid-uuid",
  "sequence_type": "T2W",
  "acquisition_date": "2024-01-20",
  "resolution": "100 μm",
  "file_path": "/data/scans/scan002.nii.gz"
}
```

---

### Pipeline Runs

#### List Pipeline Runs
```
GET /api/pipeline-runs/
```
Query Parameters:
- `mri_scan` (optional): Filter by scan UUID
- `stage` (optional): Filter by stage (PREPROCESSING, GMM, UNET, FULL_PIPELINE)
- `status` (optional): Filter by status (PENDING, RUNNING, SUCCESS, FAILED)

Response:
```json
{
  "results": [
    {
      "id": "uuid",
      "mri_scan": "scan-uuid",
      "scan_info": {
        "id": "scan-uuid",
        "organoid_name": "Organoid 1",
        "sequence_type": "T1W"
      },
      "stage": "GMM",
      "status": "SUCCESS",
      "started_at": "2024-01-20T10:00:00Z",
      "finished_at": "2024-01-20T10:05:00Z",
      "log_excerpt": "GMM segmentation completed",
      "config_json": {"n_components": 3},
      "docker_image": "",
      "cli_command": "python -m mri_pipeline.gmm ...",
      "created_at": "2024-01-20T09:59:00Z",
      "has_result": true
    }
  ]
}
```

#### Create Pipeline Run
```
POST /api/pipeline-runs/
```
Body:
```json
{
  "mri_scan": "scan-uuid",
  "stage": "GMM",
  "status": "PENDING",
  "config_json": {
    "n_components": 3,
    "max_iter": 100
  }
}
```

**Note**: After creating a PENDING run, execute the management command to process it:
```bash
docker compose run backend python manage.py run_pipeline_jobs
```

---

### Segmentation Results

#### List Results
```
GET /api/segmentation-results/
```
Query Parameters:
- `pipeline_run` (optional): Filter by pipeline run UUID

Response:
```json
{
  "results": [
    {
      "id": "uuid",
      "pipeline_run": "run-uuid",
      "pipeline_run_info": {
        "id": "run-uuid",
        "stage": "GMM",
        "organoid_name": "Organoid 1",
        "sequence_type": "T1W"
      },
      "mask_path": "/data/results/mask.nii.gz",
      "preview_image_path": "/data/results/preview.png",
      "model_version": "GMM-v1.0",
      "created_at": "2024-01-20T10:05:00Z",
      "metrics": [
        {
          "id": "uuid",
          "metric_name": "Dice",
          "metric_value": 0.85,
          "unit": "score"
        }
      ]
    }
  ]
}
```

---

### Metrics

#### List Metrics
```
GET /api/metrics/
```
Query Parameters:
- `segmentation_result` (optional): Filter by result UUID
- `metric_name` (optional): Filter by metric name (Dice, IoU, Volume)

Response:
```json
{
  "results": [
    {
      "id": "uuid",
      "segmentation_result": "result-uuid",
      "metric_name": "Dice",
      "metric_value": 0.85,
      "unit": "score",
      "created_at": "2024-01-20T10:05:00Z"
    }
  ]
}
```

---

### Contact & FAQs

#### Send Contact Message
```
POST /api/contact/
```
Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question",
  "message": "Hello..."
}
```

#### List FAQs
```
GET /api/faqs/
```

---

## Typical Workflows

### Workflow 1: Create and Process an Organoid

1. **Create Organoid**
   ```bash
   POST /api/organoids/
   ```

2. **Add MRI Scan**
   ```bash
   POST /api/scans/
   ```

3. **Start Pipeline Run**
   ```bash
   POST /api/pipeline-runs/
   {
     "mri_scan": "scan-uuid",
     "stage": "GMM",
     "status": "PENDING"
   }
   ```

4. **Process Pipeline (CLI)**
   ```bash
   docker compose run backend python manage.py run_pipeline_jobs
   ```

5. **Check Status**
   ```bash
   GET /api/pipeline-runs/{run-id}/
   ```

6. **View Results**
   ```bash
   GET /api/segmentation-results/?pipeline_run={run-id}
   ```

7. **View Metrics**
   ```bash
   GET /api/metrics/?segmentation_result={result-id}
   ```

---

## Error Responses

All endpoints return standard HTTP status codes:

- `200 OK`: Successful GET/PUT/PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Invalid input
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error response format:
```json
{
  "detail": "Error message"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding in production.

---

## Pagination

All list endpoints use page number pagination:
- Default page size: 10
- Query parameters: `?page=2`

---

## Future Enhancements

- Authentication & Authorization
- File upload endpoints for NIfTI files
- Webhook notifications for pipeline completion
- Real-time WebSocket updates for pipeline status
