from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from app.db.base import Base

class RoleEnum(str, enum.Enum):
    admin = "ADMIN"
    super = "SUPER"
    common = "COMMON"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    full_name = Column(String(50), nullable=True)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.common)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_access = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tasks_created = relationship("Task", foreign_keys="[Task.created_by_id]", back_populates="created_by")
    tasks_assigned = relationship("Task", foreign_keys="[Task.assigned_to_id]", back_populates="assigned_to")