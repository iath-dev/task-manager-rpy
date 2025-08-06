from pydantic import BaseModel, Field, EmailStr
from enum import Enum

class RoleEnum(str, Enum):
    admin = "ADMIN"
    super = "SUPER"
    common = "COMMON"

class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=6)
    full_name: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True