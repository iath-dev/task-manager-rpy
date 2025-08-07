from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate
from app.services.auth_service import login_user, register_user
from app.api.deps import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    User login
    """
    return login_user(db, login_data.email, login_data.password)

@router.post("/register", response_model=TokenResponse)
def login(register_request: UserCreate, db: Session = Depends(get_db)):
    """
    Register user
    """
    return register_user(db, register_request)