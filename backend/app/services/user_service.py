import json
from sqlalchemy.orm import Session

from app.db.models.user import User
from app.schemas.user import UserCreate
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

def get_users(db: Session):
    """
    Get all users from the database
    """
    return db.query(User).all()

def create_user(db: Session, user: UserCreate):
    """
    Create user with a specific role.
    """
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        password=hash_password(user.password),
        role=user.role
    )
    db.add(db_user)
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