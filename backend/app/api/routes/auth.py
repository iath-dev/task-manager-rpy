from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.auth import LoginRequest, LoginResponse
from app.schemas.user import UserCreate, UserOut
from app.services.auth_service import login_user, register_user
from app.api.deps import get_db, get_current_user, get_current_user_for_refresh
from app.db.models.user import User
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    User login
    """
    return login_user(db, login_data.email, login_data.password)

@router.post("/register", response_model=LoginResponse)
def register(register_request: UserCreate, db: Session = Depends(get_db)):
    """
    Register user
    """
    return register_user(db, register_request)

@router.post("/refresh-token", response_model=LoginResponse)
def refresh_token(current_user: User = Depends(get_current_user_for_refresh)):
    """
    Refresh access token
    """
    token = create_access_token(user_id=current_user.id, email=current_user.email, role=current_user.role.value)
    return {"access_token": token, "token_type": "bearer", "user": current_user}


@router.get("/me", response_model=UserOut)
def get_user_me(current_user: User = Depends(get_current_user)):
    """
    Get current user
    """
    return current_user