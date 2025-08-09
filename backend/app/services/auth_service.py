from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.db.models.user import User
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.user import UserCreate

def auth_user(db: Session, email: str, password: str):
    """
    Verify if the user is register in the database and the password is valid
    """
    user = db.query(User).filter(User.email == email).first()
    
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Credential")
    return user

def login_user(db: Session, email: str, password: str):
    """
    Login user and generate the JWT
    """
    user = auth_user(db, email, password)
    token = create_access_token(user_id=user.id, email=user.email, role=user.role.value)
    return {"access_token": token, "token_type": "bearer", "user": user}

def register_user(db: Session, user: UserCreate):
    """
    Register user and generate the JWT
    """
    check_user = db.query(User).filter(User.email == user.email).first()
    
    if check_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already registered")
    
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        password=hash_password(user.password),
        role=user.role # Ensure role is passed from UserCreate
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    token = create_access_token(user_id=db_user.id, email=db_user.email, role=db_user.role.value)
    return {"access_token": token, "token_type": "bearer", "user": db_user}