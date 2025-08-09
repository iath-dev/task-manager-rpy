from fastapi.testclient import TestClient
from http import HTTPStatus
from typing import Dict

from app.db.models.user import User

def test_create_task(client: TestClient, test_user_token_headers: Dict[str, str]):
    response = client.post(
        "/api/v1/tasks/",
        headers=test_user_token_headers,
        json={"title": "Test Task", "description": "Test Description"},
    )
    assert response.status_code == HTTPStatus.CREATED
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["completed"] is False

def test_read_tasks(client: TestClient, test_user_token_headers: Dict[str, str]):
    response = client.get("/api/v1/tasks/", headers=test_user_token_headers)
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert isinstance(data["items"], list)

def test_unauthenticated_user_cannot_create_task(client: TestClient):
    response = client.post(
        "/api/v1/tasks/",
        json={"title": "Test Task", "description": "Test Description"},
    )
    assert response.status_code == HTTPStatus.UNAUTHORIZED
