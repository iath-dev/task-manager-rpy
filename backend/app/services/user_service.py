from sqlalchemy.orm import Session

from app.db.models.user import User
from app.schemas.user import UserCreate
from app.core.security import hash_password

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
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