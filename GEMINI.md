## Project Details

This document outlines the requirements for a full-stack task management application.

### Backend (FastAPI)

- **API:** Create a RESTful API for managing tasks.
- **Authentication:** Implement JWT authentication with two user roles: `admin` and `regular user`.
- **Database:** Use PostgreSQL for data persistence with automatic migrations.
- **Real-time:** Implement WebSockets for real-time updates (Optional).
- **Notifications:** Create a notification system for upcoming task deadlines (Optional).
- **Features:**
    - Advanced filtering, sorting, and pagination for tasks.
    - Rate limiting and CSRF protection.
- **Endpoints:**
    - `GET /tasks`: Retrieve a list of tasks with filtering and pagination.
    - `POST /tasks`: Create a new task.
    - `PUT /tasks/{id}`: Update an existing task.
    - `DELETE /tasks/{id}`: Delete a task.
    - `GET /tasks/statistics`: Get task statistics (completed/pending).
    - `POST /tasks/{id}/comments`: Add a comment to a task.
- **Task Model:**
    - `id`: Unique identifier.
    - `title`: Task title.
    - `description`: Task description.
    - `completed`: Boolean indicating if the task is completed.
    - `due_date`: Deadline for the task.
    - `priority`: Priority level (high, medium, low).
    - `created_by`: User who created the task.
    - `assigned_to`: User the task is assigned to.
    - `created_at`: Timestamp of creation.
    - `updated_at`: Timestamp of the last update.

### Frontend (React)

- **Language:** Use TypeScript with strict types.
- **State Management:** Use Redux or a similar tool for state management.
- **Styling:** Use any styling framework.
- **Features:**
    - Dark/light mode with preference persistence (Optional).
    - Lazy loading and code splitting.
    - Visualizations and charts for task analytics.
- **Components:**
    - Dashboard with task metrics.
    - Task list with advanced filtering and sorting.
    - Form for creating and editing tasks with validation.
    - Statistics section with charts.
    - Admin panel for user management (admin role).
    - Real-time notification system (Optional).

### Testing

- **Backend:** Minimum 85% test coverage.
- **Frontend:** Component tests with Cypress.
- **API:** Tests for each API endpoint.
- **Mocks:** Implement mocks for external services.

### DevOps & Deployment

- **Containerization:** Create Dockerfiles for both backend and frontend.
- **Orchestration:** Use `docker-compose.yml` to run all services.
- **Logging:** Centralized logging.
- **Health Checks:** Implement health checks and circuit breakers.

### Security

- **Protection:** Add protection against SQL injection and XSS.
- **Validation:** Implement input data validation in all APIs.

### Deliverables

- Source code for backend and frontend in a GitHub repository.
- Dockerfiles for backend and frontend.
- `docker-compose.yml` for running the services.
- Unit tests with pytest for the backend.
- API documentation with Swagger/OpenAPI.
- System architecture diagram.
- Detailed installation and setup instructions.
- A report (max 1 page) detailing the development process, approach, and tools used.
