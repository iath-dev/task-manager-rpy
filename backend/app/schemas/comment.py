from pydantic import BaseModel
from datetime import datetime
from app.schemas.user import UserOutPublic

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    task_id: int
    owner: UserOutPublic
    created_at: datetime

    class Config:
        from_attributes = True
