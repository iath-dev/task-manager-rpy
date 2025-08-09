import pytest
from typing import Generator, Dict
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.main import app
from app.db.base import Base
from app.api.deps import get_db
from app.core.config import settings
from app.schemas.user import UserCreate
from app.services import user_service
from app.core.security import create_access_token
from app.db.models.user import User

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def db_setup_and_teardown():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def get_db_override():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.rollback()
        db.close()

app.dependency_overrides[get_db] = get_db_override

@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    db = TestingSessionLocal()
    yield db
    db.close()

@pytest.fixture(scope="function")
def test_user(db_session: Session) -> User:
    import uuid
    from app.schemas.user import RoleEnum
    user_in = UserCreate(
        email=f"test_{uuid.uuid4()}@example.com",
        password="password",
        username=f"testuser_{uuid.uuid4().hex[:8]}",
        full_name="Test User",
        role=RoleEnum.common
    )
    return user_service.create_user(db_session, user_in)

@pytest.fixture(scope="function")
def admin_user(db_session: Session) -> User:
    import uuid
    from app.schemas.user import RoleEnum
    user_in = UserCreate(
        email=f"admin_{uuid.uuid4()}@example.com",
        password="password",
        username=f"adminuser_{uuid.uuid4().hex[:8]}",
        full_name="Admin User",
        role=RoleEnum.admin
    )
    return user_service.create_user(db_session, user_in)

@pytest.fixture(scope="function")
def test_user_token_headers(test_user: User) -> Dict[str, str]:
    token = create_access_token(user_id=test_user.id, email=test_user.email, role=test_user.role)
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture(scope="function")
def admin_user_token_headers(admin_user: User) -> Dict[str, str]:
    token = create_access_token(user_id=admin_user.id, email=admin_user.email, role=admin_user.role)
    return {"Authorization": f"Bearer {token}"}