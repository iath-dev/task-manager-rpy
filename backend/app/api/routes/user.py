from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserOut, UserOutPublic
from app.services import user_service
from app.api.deps import get_db, require_role
from app.schemas.user import RoleEnum

router = APIRouter(prefix="/users", tags=["Users"], dependencies=[Depends(require_role([RoleEnum.admin, RoleEnum.admin]))])

@router.get("/", response_model=list[UserOutPublic])
def read_users(db: Session = Depends(get_db)):
    """
    Get all users
    """
    return user_service.get_users(db)

@router.get("/{user_id}", response_model=UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    """
    Get user by ID
    """
    user = user_service.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create an user
    """
    existing = user_service.get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=404, detail="couldn't create user")
    
    return user_service.create_user(db, user=user)

