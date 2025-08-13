from pydantic import BaseModel, Field, EmailStr
from enum import Enum
from app.schemas.common import QueryParams

class RoleEnum(str, Enum):
    admin = "ADMIN"
    super = "SUPER"
    common = "COMMON"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: RoleEnum

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserOut(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: str | None = None
    is_active: bool | None = None
    role: RoleEnum | None = None

class UserLogin(UserBase):
    id: int
    role: RoleEnum

    class Config:
        from_attributes = True

class UserOutPublic(BaseModel):
    email: EmailStr
    full_name: str

    class Config:
        from_attributes = True

class UserSortOptions(str, Enum):
    full_name_asc = "full_name_asc"
    full_name_desc = "full_name_desc"
    email_asc = "email_asc"
    email_desc = "email_desc"

class UserQueryParams(QueryParams):
    full_name: str | None = None
    role: RoleEnum | None = None
    sort_by: UserSortOptions | None = None
