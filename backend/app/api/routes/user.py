from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserOut, UserOutPublic, UserUpdate, UserPaginated, UserFilter, UserSortOptions
from app.services import user_service
from app.api.deps import get_db, require_role
from app.schemas.user import RoleEnum

router = APIRouter(prefix="/users", tags=["Users"], dependencies=[Depends(require_role([RoleEnum.admin, RoleEnum.super]))])

@router.get("/", response_model=UserPaginated)
def read_users(db: Session = Depends(get_db), page: int = 1, page_size: int = 10, full_name: str | None = None, role: RoleEnum | None = None, sort_by: UserSortOptions = UserSortOptions.full_name_asc):
    """
    Get all users with pagination, filtering, and sorting
    """
    user_filter = UserFilter(full_name=full_name, role=role)
    return user_service.get_users(db, page=page, page_size=page_size, user_filter=user_filter, sort_by=sort_by)

@router.get("/emails", response_model=list[str])
def read_users_emails(db: Session = Depends(get_db)):
    """
    Get all users emails
    """
    return user_service.get_all_users_emails(db)

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

@router.put("/{user_id}", response_model=UserOut)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    """
    Update an user
    """
    updated_user = user_service.update_user(db, user_id, user)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.delete("/{user_id}", response_model=UserOut)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Delete an user
    """
    deleted_user = user_service.delete_user(db, user_id)
    if not deleted_user:
        raise HTTPException(status_code=404, detail="User not found")
    return deleted_user

