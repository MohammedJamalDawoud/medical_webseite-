# API Documentation

Base URL: `http://localhost:8000/api`

## Endpoints

### Organoids
- **GET** `/organoids/`
  - Returns a list of all organoid samples.
  - Query Params: None
  - Response: `[ { id, name, species, description, date_created, scans_count } ]`

### Scans
- **GET** `/scans/`
  - Returns a list of MRI scans.
  - Query Params: `organoid={id}` (Filter by organoid ID)
  - Response: `[ { id, organoid, sequence_name, acquisition_date, resolution, file_path } ]`

### Processing Steps
- **GET** `/processing-steps/`
  - Returns processing steps for a scan.
  - Query Params: `scan={id}` (Filter by scan ID)
  - Response: `[ { id, scan, step_name, status, started_at, completed_at, has_segmentation } ]`

### Segmentation Results
- **GET** `/segmentation-results/`
  - Returns segmentation metrics and result file paths.
  - Query Params: None (or filter by step ID if implemented)
  - Response: `[ { id, processing_step, dice_score, jaccard_index, volume_mm3, visualization_path } ]`

### Publications
- **GET** `/publications/`
  - Returns a list of publications.
  - Response: `[ { id, title, authors, journal, year, doi, abstract, url } ]`

### FAQs
- **GET** `/faqs/`
  - Returns a list of frequently asked questions.
  - Response: `[ { id, question, answer } ]`

### Contact
- **POST** `/contact/`
  - Sends a contact message.
  - Body: `{ name, email, subject, message }`
  - Response: `200 OK` or `400 Bad Request`
