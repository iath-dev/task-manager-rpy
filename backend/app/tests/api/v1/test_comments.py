from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.db.models.task import Task
from app.schemas.task import TaskCreate
from app.services.task_service import create_task
from app.db.models.user import User
import time

def test_create_comment_for_task(client: TestClient, db_session: Session, test_user: User, test_user_token_headers: dict):
    # Create a task first
    task_in = TaskCreate(title="Test Task for Comment", description="Description for comment test")
    task = create_task(db_session, task_in, test_user.id)

    comment_data = {"content": "This is a test comment."}
    response = client.post(
        f"/api/v1/tasks/{task.id}/comments",
        json=comment_data,
        headers=test_user_token_headers
    )
    assert response.status_code == 201
    content = response.json()
    assert content["content"] == comment_data["content"]
    assert content["task_id"] == task.id
    assert content["owner"]["email"] == test_user.email
    assert content["owner"]["full_name"] == test_user.full_name

def test_create_comment_for_nonexistent_task(client: TestClient, test_user_token_headers: dict):
    comment_data = {"content": "This is a test comment."}
    response = client.post(
        "/api/v1/tasks/99999/comments",  # Non-existent task ID
        json=comment_data,
        headers=test_user_token_headers
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"

def test_create_comment_unauthenticated(client: TestClient, db_session: Session, test_user: User):
    # Create a task first
    task_in = TaskCreate(title="Test Task for Comment", description="Description for comment test")
    task = create_task(db_session, task_in, test_user.id)

    comment_data = {"content": "This is a test comment."}
    response = client.post(
        f"/api/v1/tasks/{task.id}/comments",
        json=comment_data
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_get_comments_for_task(client: TestClient, db_session: Session, test_user: User, test_user_token_headers: dict):
    # Create a task first
    task_in = TaskCreate(title="Test Task for Comment", description="Description for comment test")
    task = create_task(db_session, task_in, test_user.id)

    # Create a comment for the task
    comment_data = {"content": "This is a test comment."}
    client.post(
        f"/api/v1/tasks/{task.id}/comments",
        json=comment_data,
        headers=test_user_token_headers
    )

    response = client.get(
        f"/api/v1/tasks/{task.id}/comments",
        headers=test_user_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert isinstance(content, list)
    assert len(content) > 0
    assert content[0]["content"] == comment_data["content"]
    assert content[0]["task_id"] == task.id
    assert content[0]["owner"]["email"] == test_user.email

def test_get_comments_for_task_order(client: TestClient, db_session: Session, test_user: User, test_user_token_headers: dict):
    # Create a task first
    task_in = TaskCreate(title="Test Task for Comment Order", description="Description for comment order test")
    task = create_task(db_session, task_in, test_user.id)

    # Create a comment for the task
    comment_data_1 = {"content": "First comment"}
    client.post(
        f"/api/v1/tasks/{task.id}/comments",
        json=comment_data_1,
        headers=test_user_token_headers
    )

    time.sleep(0.1)

    comment_data_2 = {"content": "Second comment"}
    client.post(
        f"/api/v1/tasks/{task.id}/comments",
        json=comment_data_2,
        headers=test_user_token_headers
    )

    response = client.get(
        f"/api/v1/tasks/{task.id}/comments",
        headers=test_user_token_headers
    )
    assert response.status_code == 200
    content = response.json()
    assert isinstance(content, list)
    assert len(content) == 2
    assert content[0]["content"] == comment_data_2["content"]
    assert content[1]["content"] == comment_data_1["content"]
    assert content[0]["owner"]["email"] == test_user.email
    assert content[1]["owner"]["email"] == test_user.email

def test_get_comments_for_nonexistent_task(client: TestClient, test_user_token_headers: dict):
    response = client.get(
        "/api/v1/tasks/99999/comments",  # Non-existent task ID
        headers=test_user_token_headers
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"

def test_get_comments_unauthenticated(client: TestClient, db_session: Session, test_user: User):
    # Create a task first
    task_in = TaskCreate(title="Test Task for Comment", description="Description for comment test")
    task = create_task(db_session, task_in, test_user.id)

    response = client.get(
        f"/api/v1/tasks/{task.id}/comments"
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"