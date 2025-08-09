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
    response = client.get("/api/v1/users/", headers=admin_user_token_headers)
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    # Check that the admin user is in the list
    assert any(user["email"] == admin_user.email for user in data)