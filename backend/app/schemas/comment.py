from pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    task_id: int
    owner_id: int
    created_at: datetime

    class Config:
        orm_mode = True
