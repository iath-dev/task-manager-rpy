from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.db.models.user import User
from app.core.security import verify_password, create_access_token

def auth_user(db: Session, email: str, password: str):
    """
    Verify if the user is register in the database and the password is valid
    """
    user = db.query(User).filter(User.email == email).first()
    print(verify_password(password, user.password))
    
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Credential")
    return user

def login_user(db: Session, email: str, password: str):
    """
    Login user and generate the JWT
    """
    user = auth_user(db, email, password)
    token = create_access_token({"sub": str(user.id), "role": str(user.role)})
    return {"access_token": token, "token_type": "bearer"}