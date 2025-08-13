#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
    This script is responsible for the tests of the authentication.
"""

from http import HTTPStatus
from typing import Dict

from fastapi.testclient import TestClient

from app.core.security import decode_token


def test_refresh_token(client: TestClient, test_user_token_headers: Dict[str, str]):
    """Test that a user can refresh their access token."""
    response = client.post("/api/v1/auth/refresh-token", headers=test_user_token_headers)
    assert response.status_code == HTTPStatus.OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    # Check that the new token is valid
    new_token = data["access_token"]
    payload = decode_token(new_token)
    assert payload is not None
