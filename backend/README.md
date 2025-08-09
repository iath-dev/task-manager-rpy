# Task Manager Backend

FastAPI project for task management.

## API Endpoints

- `POST /api/v1/seed/`: Seeds the database with initial user data (normal, admin, superuser). Password for all seeded users is `123456`.

## Testing

To run the tests and generate a coverage report, use the following commands:

1.  **Install development dependencies (if not already installed):**

    ```bash
    poetry install --with dev
    ```

2.  **Run tests with coverage:**

    ```bash
    poetry run pytest --cov=app
    ```

    This will execute all tests and display a coverage summary in the terminal. The current coverage is **79%**. The goal is to achieve a minimum of 85% test coverage.

    To generate a detailed HTML coverage report (useful for exploring coverage line by line):

    ```bash
    poetry run coverage html
    ```

    After running this command, open `htmlcov/index.html` in your browser to view the report.

### Missing Features

Here's a list of features that are planned but not yet implemented in the backend:

- Real-time updates using WebSockets (Optional).
- Notification system for upcoming task deadlines (Optional).
- Advanced filtering, sorting, and pagination for tasks.
- Rate limiting and CSRF protection.
- Task statistics endpoint (`GET /api/v1/tasks/statistics`).
- Adding comments to a task endpoint (`POST /api/v1/tasks/{id}/comments`).
- Achieve minimum 85% test coverage.
