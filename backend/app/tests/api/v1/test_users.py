from fastapi.testclient import TestClient
from http import HTTPStatus
from typing import Dict

from app.db.models.user import User

def test_get_users_unauthenticated(client: TestClient):
    """Test that an unauthenticated user cannot get the list of users."""
    response = client.get("/api/v1/users/")
    assert response.status_code == HTTPStatus.UNAUTHORIZED

def test_get_users_as_regular_user(client: TestClient, test_user_token_headers: Dict[str, str]):
    """Test that a regular user cannot get the list of users."""
    response = client.get("/api/v1/users/", headers=test_user_token_headers)
    assert response.status_code == HTTPStatus.FORBIDDEN

def test_get_users_as_admin(client: TestClient, admin_user_token_headers: Dict[str, str], admin_user: User):
    """Test that an admin user can get the list of users."""
    from app.schemas.user import RoleEnum
    assert admin_user.role == RoleEnum.admin
    response = client.get("/api/v1/users/?page=1&page_size=10", headers=admin_user_token_headers)
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert "items" in data
    assert "total_items" in data
    assert "page" in data
    assert "size" in data
    assert isinstance(data["items"], list)
    assert len(data["items"]) > 0
    # Check that the admin user is in the list
    assert any(user["email"] == admin_user.email for user in data["items"])

def test_deactivated_user_cannot_login(client: TestClient, test_user: User, admin_user_token_headers: Dict[str, str]):
    """Test that a deactivated user cannot log in."""
    # Deactivate the user first
    response = client.delete(f"/api/v1/users/{test_user.id}", headers=admin_user_token_headers)
    assert response.status_code == HTTPStatus.OK

    # Attempt to log in as the deactivated user
    response = client.post(
        "/api/v1/auth/login",
        json={"email": test_user.email, "password": "password"}
    )
    assert response.status_code == HTTPStatus.UNAUTHORIZED