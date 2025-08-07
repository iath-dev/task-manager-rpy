
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from typing import Optional

from app.schemas.user import UserOut

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
    created_by: UserOut
    assigned_to: Optional[UserOut] = None
    created_at: datetime
    updated_at: datetime
    completed: bool

    class Config:
        from_attributes = True
