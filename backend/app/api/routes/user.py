from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate, UserOut, UserOutPublic, UserUpdate, UserSortOptions, UserQueryParams
from app.schemas.common import Page
from app.services import user_service
from app.api.deps import get_db, require_role
from app.schemas.user import RoleEnum

router = APIRouter(prefix="/users", tags=["Users"], dependencies=[Depends(require_role([RoleEnum.admin, RoleEnum.super]))])

@router.get("/", response_model=Page[UserOut], summary="Read Users", description="Retrieve a list of users with pagination, filtering, and sorting. (Admin/Super role required)")
def read_users(query_params: UserQueryParams = Depends(), db: Session = Depends(get_db)):
    """
    Get all users with pagination, filtering, and sorting
    """
    return user_service.get_users(db, query_params=query_params)

@router.get("/emails", response_model=list[str], summary="Read Users Emails", description="Retrieve a list of all user emails. (Admin/Super role required)", status_code=status.HTTP_200_OK)
def read_users_emails(db: Session = Depends(get_db)):
    """
    Get all users emails
    """
    return user_service.get_all_users_emails(db)

@router.get("/{user_id}", response_model=UserOut, summary="Read User by ID", description="Retrieve a single user by their ID. (Admin/Super role required)", status_code=status.HTTP_200_OK)
def read_user(user_id: int, db: Session = Depends(get_db)):
    """
    Get user by ID
    """
    user = user_service.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserOut, summary="Create User", description="Create a new user. (Admin/Super role required)", status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create an user
    """
    existing = user_service.get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=404, detail="couldn't create user")
    
    return user_service.create_user(db, user=user)

@router.put("/{user_id}", response_model=UserOut, summary="Update User", description="Update an existing user by their ID. (Admin/Super role required)", status_code=status.HTTP_200_OK)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    """
    Update an user
    """
    updated_user = user_service.update_user(db, user_id, user)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.delete("/{user_id}", response_model=UserOut, summary="Delete User (Deactivate)", description="Deactivate a user by their ID (soft delete). (Admin/Super role required)", status_code=status.HTTP_200_OK)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Delete an user
    """
    deleted_user = user_service.delete_user(db, user_id)
    if not deleted_user:
        raise HTTPException(status_code=404, detail="User not found")
    return deleted_user

