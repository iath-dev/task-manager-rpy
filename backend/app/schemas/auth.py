from pydantic import BaseModel, EmailStr

from app.schemas.user import UserLogin

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginResponse(TokenResponse):
    user: UserLogin
