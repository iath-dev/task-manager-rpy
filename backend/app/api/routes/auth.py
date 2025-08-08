from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.auth import LoginRequest, LoginResponse
from app.schemas.user import UserCreate, UserOut
from app.services.auth_service import login_user, register_user
from app.api.deps import get_db, get_current_user
from app.db.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    User login
    """
    return login_user(db, login_data.email, login_data.password)

@router.post("/register", response_model=LoginResponse)
def login(register_request: UserCreate, db: Session = Depends(get_db)):
    """
    Register user
    """
    return register_user(db, register_request)

@router.get("/me", response_model=UserOut)
def get_user_me(current_user: User = Depends(get_current_user)):
    """
    Get current user
    """
    return current_user