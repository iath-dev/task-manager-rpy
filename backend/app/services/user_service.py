from sqlalchemy.orm import Session

from app.db.models.user import User, RoleEnum
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
    Create user with a basic common role
    """
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        password=hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

def seed_users(db: Session):
    """
    Seeds the database with initial user data if they don't already exist.
    Creates a normal user, an admin user, and a superuser.
    """
    # Create a normal user with 'common' role
    if not get_user_by_email(db, "user@example.com"):
        db_normal_user = User(
            email="user@example.com",
            username="normaluser",
            full_name="Normal User",
            password=hash_password("123456"),
            role=RoleEnum.common
        )
        db.add(db_normal_user)
        db.commit()
        db.refresh(db_normal_user)

    # Create an admin user with 'admin' role
    if not get_user_by_email(db, "admin@example.com"):
        db_admin = User(
            email="admin@example.com",
            username="adminuser",
            full_name="Admin User",
            password=hash_password("123456"),
            role=RoleEnum.admin
        )
        db.add(db_admin)
        db.commit()
        db.refresh(db_admin)

    # Create a superuser with 'super' role
    if not get_user_by_email(db, "super@example.com"):
        db_super = User(
            email="super@example.com",
            username="superuser",
            full_name="Super User",
            password=hash_password("123456"),
            role=RoleEnum.super
        )
        db.add(db_super)
        db.commit()
        db.refresh(db_super)