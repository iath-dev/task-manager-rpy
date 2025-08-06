from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from typing import List

from app.schemas.user import UserCreate, UserOut
from app.services import user_service
from app.api.deps import get_db

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/{user_id}", response_model=UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = user_service.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = user_service.get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=404, detail="couldn't create user")
    
    return user_service.create_user(db, user=user)

