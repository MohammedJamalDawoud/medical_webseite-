# Architecture Overview

## System Design
The application follows a standard client-server architecture.

### Backend (Django)
- **Role**: REST API provider, data persistence, business logic.
- **Apps**:
  - `core`: Shared utilities and configuration.
  - `experiments`: Main domain logic (Organoids, Scans, Processing).
- **Database**: Relational database (SQLite for dev, PostgreSQL for prod) storing metadata and file paths.

### Frontend (React)
- **Role**: User interface, data visualization, interaction.
- **State Management**: React hooks (`useState`, `useEffect`) for local state.
- **Routing**: Client-side routing via `react-router-dom`.
- **Styling**: Utility-first CSS with Tailwind.

## Data Flow
1. **Data Ingestion**: MRI data and processing results are registered in the backend via management commands or admin interface.
2. **API**: Frontend requests data via HTTP GET requests to `/api/` endpoints.
3. **Visualization**: Frontend renders tables, lists, and charts based on the JSON response.

## Deployment Strategy
- **Backend**: Dockerized Django container served via Gunicorn/Nginx.
- **Frontend**: Static build served via Nginx or CDN (e.g., Vercel/Netlify).
- **Database**: Managed PostgreSQL instance.
