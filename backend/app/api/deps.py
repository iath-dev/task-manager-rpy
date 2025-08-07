from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from typing import Union, List

from app.schemas.user import RoleEnum
from app.db.session import SessionLocal
from app.core.security import decode_token

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

def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Get current user
    """
    try:
        payload = decode_token(token)
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
def require_role(roles: Union[RoleEnum, List[RoleEnum]]):
    """
    Check if the user have the access by the role
    """
    if isinstance(roles, RoleEnum):
        roles = [roles]

    def dependency(user: dict = Depends(get_current_user)):
        if user.get("role") in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return dependency