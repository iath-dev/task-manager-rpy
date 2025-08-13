import pytest
from typing import Generator, Dict, Any

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.config import settings

settings.DATABASE_URL = "sqlite:///./test.db"

from app.main import app
from app.db.base import Base
from app.api.deps import get_db
from app.schemas.user import UserCreate
from app.services import user_service
from app.core.security import create_access_token
from app.db.models.user import User
from app.db.session import engine, SessionLocal


@pytest.fixture(scope="session", autouse=True)
def db_setup_and_teardown():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="session", autouse=True)
def seed_users_data():
    db = SessionLocal()
    user_service.seed_users(db)
    db.close()

def get_db_override():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.rollback()
        db.close()

app.dependency_overrides[get_db] = get_db_override

@pytest.fixture(scope="function")
def client(db_session: Session) -> Generator[TestClient, None, None]:
    app.dependency_overrides[get_db] = lambda: db_session
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.pop(get_db)

@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    db = SessionLocal()
    yield db
    db.close()

@pytest.fixture(scope="function")
def test_user(db_session: Session) -> User:
    import uuid
    from app.schemas.user import RoleEnum
    user_in = UserCreate(
        email=f"test_{uuid.uuid4()}@example.com",
        password="password",
        full_name=f"Test User {uuid.uuid4()}",
        role=RoleEnum.common
    )
    return user_service.create_user(db_session, user_in)

@pytest.fixture(scope="function")
def admin_user(db_session: Session) -> User:
    return user_service.get_user_by_email(db_session, "admin@example.com")

@pytest.fixture(scope="function")
def test_user_token_headers(test_user: User) -> Dict[str, Any]:
    token = create_access_token(user_id=test_user.id, email=test_user.email, role=test_user.role)
    return {"Authorization": f"Bearer {token}", "user_id": str(test_user.id)}

@pytest.fixture(scope="function")
def admin_user_token_headers(admin_user: User) -> Dict[str, Any]:
    token = create_access_token(user_id=admin_user.id, email=admin_user.email, role=admin_user.role)
    return {"Authorization": f"Bearer {token}", "user_id": str(admin_user.id)}