import json
import math
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserSortOptions, UserOut, UserQueryParams
from app.schemas.common import Page
from app.core.security import hash_password

def get_user(db: Session, user_id: int):
    """
    Search the user in the database by the ID
    """
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    """
    Check if the user email is registered in the database
    """
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, query_params: UserQueryParams) -> Page[UserOut]:
    """
    Get all users from the database with pagination, filtering, and sorting.
    """
    query = db.query(User)

    if query_params.full_name:
        query = query.filter(User.full_name.ilike(f"%{query_params.full_name}%"))
    if query_params.role:
        query = query.filter(User.role == query_params.role)

    total = query.count()
    total_pages = math.ceil(total / query_params.page_size)

    if query_params.sort_by == UserSortOptions.full_name_asc:
        query = query.order_by(User.full_name.asc())
    elif query_params.sort_by == UserSortOptions.full_name_desc:
        query = query.order_by(User.full_name.desc())
    elif query_params.sort_by == UserSortOptions.email_asc:
        query = query.order_by(User.email.asc())
    elif query_params.sort_by == UserSortOptions.email_desc:
        query = query.order_by(User.email.desc())

    skip = (query_params.page - 1) * query_params.page_size
    users = query.offset(skip).limit(query_params.page_size).all()
    return Page(items=users, total_items=total, total_pages=total_pages, page=query_params.page, page_size=query_params.page_size)

def get_all_users_emails(db: Session):
    """
    Get all users emails from the database.
    """
    return [user.email for user in db.query(User).all()]

def create_user(db: Session, user: UserCreate):
    """
    Create user with a specific role.
    """
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        password=hash_password(user.password),
        role=user.role,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

def update_user(db: Session, user_id: int, user_update: UserUpdate):
    """
    Update user information.
    """
    db_user = get_user(db, user_id)
    if not db_user:
        return None

    update_data = user_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    """
    Deactivate a user (soft delete).
    """
    db_user = get_user(db, user_id)
    if not db_user:
        return None

    db_user.is_active = False
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_last_access(db: Session, user_id: int):
    """
    Update user last access timestamp.
    """
    db_user = get_user(db, user_id)
    if db_user:
        db_user.last_access = func.now()
        db.commit()
        db.refresh(db_user)
    return db_user


def seed_users(db: Session):
    """
    Seeds the database with initial user data from a JSON file if they don't already exist.
    """
    with open("data/users.json", "r") as f:
        users = json.load(f)

    for user_data in users:
        if not get_user_by_email(db, user_data["email"]):
            user = UserCreate(**user_data)
            create_user(db, user)
