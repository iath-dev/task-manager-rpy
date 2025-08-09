from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from typing import Union, List

from app.db.models.user import User
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

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Get current user by decoding the JWT token.
    """
    try:
        payload = decode_token(token)
        user_id: str = payload.get("sub")
        # role: str = payload.get("role") # You can use this if you want to validate role from token
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"}
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )

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