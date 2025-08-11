import json
import math
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserFilter, UserSortOptions
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

def get_users(db: Session, page: int = 1, page_size: int = 10, user_filter: UserFilter = UserFilter(), sort_by: UserSortOptions = UserSortOptions.full_name_asc):
    """
    Get all users from the database with pagination, filtering, and sorting.
    """
    query = db.query(User)

    if user_filter.full_name:
        query = query.filter(User.full_name.ilike(f"%{user_filter.full_name}%"))
    if user_filter.role:
        query = query.filter(User.role == user_filter.role)

    total = query.count()
    total_pages = math.ceil(total / page_size)

    if sort_by == UserSortOptions.full_name_asc:
        query = query.order_by(User.full_name.asc())
    elif sort_by == UserSortOptions.full_name_desc:
        query = query.order_by(User.full_name.desc())
    elif sort_by == UserSortOptions.email_asc:
        query = query.order_by(User.email.asc())
    elif sort_by == UserSortOptions.email_desc:
        query = query.order_by(User.email.desc())

    skip = (page - 1) * page_size
    users = query.offset(skip).limit(page_size).all()
    return {"items": users, "total_items": total, "total_pages": total_pages, "page": page, "size": page_size}

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
