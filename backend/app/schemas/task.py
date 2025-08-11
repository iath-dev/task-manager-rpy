from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from typing import Optional, Literal

from app.schemas.user import UserOutPublic

class PriorityEnum(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"

class TaskOrderField(str, Enum):
    id = "id"
    title = "title"
    due_date = "due_date"
    priority = "priority"
    created_at = "created_at"
    updated_at = "updated_at"

class OrderDirection(str, Enum):
    asc = "asc"
    desc = "desc"

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: PriorityEnum = PriorityEnum.medium

class TaskCreate(TaskBase):
    assigned_to: Optional[str] = None
    completed: Optional[bool] = False

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: Optional[PriorityEnum] = None
    completed: Optional[bool] = None
    assigned_to: Optional[str] = None

class TaskOut(TaskBase):
    id: int
    created_by: UserOutPublic
    assigned_to: Optional[UserOutPublic] = None
    created_at: datetime
    updated_at: datetime
    completed: bool

    class Config:
        from_attributes = True

class TaskQueryParams(BaseModel):
    page: int = Field(1, ge=1)
    page_size: int = Field(10, ge=1, le=100)
    priority: Optional[PriorityEnum] = None
    search: Optional[str] = None
    user_email: Optional[str] = None
    assigned_to_me: bool = False
    order_by: TaskOrderField = TaskOrderField.created_at
    order_direction: OrderDirection = OrderDirection.desc

class TaskPage(BaseModel):
    items: list[TaskOut]
    total_items: int
    total_pages: int
    page: int
    page_size: int
    order_by: TaskOrderField
    order_direction: OrderDirection

class TaskStatistics(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    completed_percentage: float
    pending_percentage: float
