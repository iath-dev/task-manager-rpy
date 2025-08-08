
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from typing import Optional

from app.schemas.user import UserOut, UserOutPublic

class PriorityEnum(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: PriorityEnum = PriorityEnum.medium

class TaskCreate(TaskBase):
    assigned_to: Optional[int] = None

class TaskUpdate(TaskBase):
    completed: Optional[bool] = None
    assigned_to: Optional[int] = None

class TaskOut(TaskBase):
    id: int
    created_by: UserOutPublic
    assigned_to: Optional[UserOutPublic] = None
    created_at: datetime
    updated_at: datetime
    completed: bool

    class Config:
        from_attributes = True

class TaskPage(BaseModel):
    items: list[TaskOut]
    total_items: int
    total_pages: int
    page: int
    page_size: int
