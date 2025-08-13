from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from typing import Union, List

from app.db.models.user import User
from app.schemas.user import RoleEnum
from app.db.session import SessionLocal
from app.core.security import get_token_data

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_db() -> Session:
    """
    Get session database
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Get current user by decoding the JWT token.
    """
    payload = get_token_data(token)
    user_id: str = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user

def get_current_user_for_refresh(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Get current user by decoding the JWT token, allowing for expired tokens.
    """
    payload = get_token_data(token, ignore_expiration=True)
    user_id: str = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user

    
def require_role(roles: Union[RoleEnum, List[RoleEnum]]):
    """
    Check if the user have the access by the role
    """
    if isinstance(roles, RoleEnum):
        roles = [roles]

    def dependency(user: User = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return dependency