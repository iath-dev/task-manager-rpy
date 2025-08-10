# Task Manager Backend

FastAPI project for task management.

## API Endpoints

### Authentication

*   `POST /api/v1/auth/login`: User login.
*   `POST /api/v1/auth/register`: User registration.

### Tasks

*   `GET /api/v1/tasks/`: Retrieve a list of tasks.
    *   **Query Parameters:**
        *   `page` (int, default: 1): Page number for pagination.
        *   `page_size` (int, default: 10): Number of items per page.
        *   `priority` (string, optional): Filter by task priority (e.g., `high`, `medium`, `low`).
        *   `search` (string, optional): Search tasks by title (case-insensitive).
        *   `user_email` (string, optional): Filter tasks by the email of the user who created or is assigned to the task (admin/super users only).
        *   `assigned_to_me` (boolean, default: `false`): If `true`, filters tasks assigned to the current user.
        *   `order_by` (string, default: `created_at`): Field to order tasks by (e.g., `id`, `title`, `due_date`, `priority`, `created_at`, `updated_at`).
        *   `order_direction` (string, default: `desc`): Order direction (`asc` for ascending, `desc` for descending).
*   `POST /api/v1/tasks/`: Create a new task.
*   `PUT /api/v1/tasks/{id}`: Update an existing task.
*   `DELETE /api/v1/tasks/{id}`: Delete a task.
*   `GET /api/v1/tasks/statistics`: Get task statistics (total, completed, pending, and percentages).
*   `POST /api/v1/tasks/{id}/comments`: Add a comment to a task (Planned).

### Users

*   `GET /api/v1/users/me`: Get current user's details.
*   `GET /api/v1/users/{user_id}`: Get user by ID (admin only).
*   `GET /api/v1/users/`: List all users (admin only).

### Seed Data

*   `POST /api/v1/seed/`: Seeds the database with initial user data (normal, admin, superuser). Password for all seeded users is `123456`.

## Setup and Running

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd backend
    ```
2.  **Install Poetry:**
    If you don't have Poetry installed, follow the instructions on their official website: [https://python-poetry.org/docs/#installation](https://python-poetry.org/docs/#installation)
3.  **Install dependencies:**
    ```bash
    poetry install
    ```
4.  **Environment Variables:**
    Create a `.env` file in the `backend` directory based on `app/core/config.py`. You'll need to set up your PostgreSQL database credentials and a JWT secret key. Example:
    ```
    DATABASE_URL="postgresql://user:password@host:port/database_name"
    SECRET_KEY="your_super_secret_jwt_key"
    ALGORITHM="HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```
5.  **Run database migrations:**
    Ensure your PostgreSQL database is running and accessible.
    ```bash
    poetry run alembic upgrade head
    ```
6.  **Run the application (development):**
    ```bash
    poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    ```
    The API documentation (Swagger UI) will be available at `http://localhost:8000/docs`.

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

    This will execute all tests and display a coverage summary in the terminal. The current coverage is **93%**.

    To generate a detailed HTML coverage report (useful for exploring coverage line by line):

    ```bash
    poetry run coverage html
    ```

    After running this command, open `htmlcov/index.html` in your browser to view the report.

### Missing Features

Here's a list of features that are planned but not yet implemented in the backend:

- Real-time updates using WebSockets (Optional).
- Notification system for upcoming task deadlines (Optional).
- Rate limiting and CSRF protection.
- Adding comments to a task endpoint (`POST /api/v1/tasks/{id}/comments`).
- Achieve minimum 85% test coverage. (Achieved 93%)