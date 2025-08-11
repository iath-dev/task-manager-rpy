#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    This script is responsible for the tests of the user management.
"""

from http import HTTPStatus
from typing import Dict

from fastapi.testclient import TestClient

from app.db.models.user import User
from app.schemas.user import RoleEnum


def test_create_user_as_admin(client: TestClient, admin_user_token_headers: Dict[str, str]):
    """Test that an admin user can create a new user."""
    response = client.post(
        "/api/v1/users/",
        headers=admin_user_token_headers,
        json={
            "email": "newuser@example.com",
            "full_name": "New User",
            "password": "password",
            "role": "COMMON"
        }
    )
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["full_name"] == "New User"
    assert data["role"] == RoleEnum.common


def test_update_user_as_admin(client: TestClient, admin_user_token_headers: Dict[str, str], test_user: User):
    """Test that an admin user can update an existing user."""
    response = client.put(
        f"/api/v1/users/{test_user.id}",
        headers=admin_user_token_headers,
        json={"full_name": "Updated Name"}
    )
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data["full_name"] == "Updated Name"


def test_deactivate_user_as_admin(client: TestClient, admin_user_token_headers: Dict[str, str], test_user: User):
    """Test that an admin user can deactivate an existing user."""
    response = client.delete(f"/api/v1/users/{test_user.id}", headers=admin_user_token_headers)
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert not data["is_active"]


def test_get_single_user_as_admin(client: TestClient, admin_user_token_headers: Dict[str, str], test_user: User):
    """Test that an admin user can get a single user."""
    response = client.get(f"/api/v1/users/{test_user.id}", headers=admin_user_token_headers)
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert data["email"] == test_user.email


def test_regular_user_cannot_access_admin_endpoints(client: TestClient, test_user_token_headers: Dict[str, str]):
    """Test that a regular user cannot access admin endpoints."""
    response = client.post("/api/v1/users/", headers=test_user_token_headers, json={})
    assert response.status_code == HTTPStatus.FORBIDDEN

    response = client.put("/api/v1/users/1", headers=test_user_token_headers, json={})
    assert response.status_code == HTTPStatus.FORBIDDEN

    response = client.delete("/api/v1/users/1", headers=test_user_token_headers)
    assert response.status_code == HTTPStatus.FORBIDDEN

def test_get_users_emails_as_admin(client: TestClient, admin_user_token_headers: Dict[str, str], admin_user: User):
    """Test that an admin user can get the list of users emails."""
    response = client.get("/api/v1/users/emails", headers=admin_user_token_headers)
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert admin_user.email in data

def test_get_users_filter_by_full_name(client: TestClient, admin_user_token_headers: Dict[str, str], test_user: User):
    """Test filtering users by full name."""
    response = client.get(f"/api/v1/users/?full_name={test_user.full_name}", headers=admin_user_token_headers)
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["email"] == test_user.email

def test_get_users_filter_by_role(client: TestClient, admin_user_token_headers: Dict[str, str]):
    """Test filtering users by role."""
    response = client.get("/api/v1/users/?role=ADMIN", headers=admin_user_token_headers)
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert any(user["role"] == "ADMIN" for user in data["items"])

def test_get_users_sort_by_full_name_desc(client: TestClient, admin_user_token_headers: Dict[str, str]):
    """Test sorting users by full name in descending order."""
    response = client.get("/api/v1/users/?sort_by=full_name_desc", headers=admin_user_token_headers)
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    # Assuming there are at least two users to compare
    if len(data["items"]) >= 2:
        assert data["items"][0]["full_name"] >= data["items"][1]["full_name"]

def test_get_users_sort_by_email_asc(client: TestClient, admin_user_token_headers: Dict[str, str]):
    """Test sorting users by email in ascending order."""
    response = client.get("/api/v1/users/?sort_by=email_asc", headers=admin_user_token_headers)
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    # Assuming there are at least two users to compare
    if len(data["items"]) >= 2:
        assert data["items"][0]["email"] <= data["items"][1]["email"]
