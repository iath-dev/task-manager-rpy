
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.models.task import Task
from app.db.models.user import User, RoleEnum
from app.schemas.task import TaskCreate, TaskUpdate

def get_task(db: Session, task_id: int, user: User) -> Optional[Task]:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return None
    if user.role == RoleEnum.admin or task.created_by == user.id or task.assigned_to == user.id:
        return task
    return None

def get_tasks(db: Session, user: User, skip: int = 0, limit: int = 100) -> List[Task]:
    if user.role == RoleEnum.admin or user.role == RoleEnum.super:
        return db.query(Task).offset(skip).limit(limit).all()
    return db.query(Task).filter((Task.created_by_id == user.id) | (Task.assigned_to_id == user.id)).offset(skip).limit(limit).all()

def create_task(db: Session, task: TaskCreate, user_id: int) -> Task:
    db_task = Task(**task.model_dump(), created_by_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task_update: TaskUpdate, user: User) -> Optional[Task]:
    db_task = get_task(db, task_id, user)
    if not db_task:
        return None

    for key, value in task_update.model_dump(exclude_unset=True).items():
        setattr(db_task, key, value)

    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int, user: User) -> Optional[Task]:
    db_task = get_task(db, task_id, user)
    if not db_task:
        return None

    db.delete(db_task)
    db.commit()
    return db_task
