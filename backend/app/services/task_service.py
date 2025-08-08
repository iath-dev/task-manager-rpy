
from sqlalchemy.orm import Session
from typing import List, Optional
import math

from app.db.models.task import Task
from app.db.models.user import User, RoleEnum
from app.schemas.task import TaskCreate, TaskUpdate, PriorityEnum, TaskPage

def get_task(db: Session, task_id: int, user: User) -> Optional[Task]:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return None
    if user.role == RoleEnum.admin or task.created_by == user.id or task.assigned_to == user.id:
        return task
    return None

def get_tasks(
    db: Session,
    user: User,
    page: int = 1,
    page_size: int = 10,
    priority: Optional[PriorityEnum] = None,
    search: Optional[str] = None,
    user_email: Optional[str] = None,
) -> TaskPage:
    query = db.query(Task)

    if user.role in [RoleEnum.admin, RoleEnum.super] and user_email:
        user_to_filter = db.query(User).filter(User.email == user_email).first()
        if user_to_filter:
            query = query.filter(
                (Task.created_by_id == user_to_filter.id) | (Task.assigned_to_id == user_to_filter.id)
            )
    elif user.role not in [RoleEnum.admin, RoleEnum.super]:
        query = query.filter(
            (Task.created_by_id == user.id) | (Task.assigned_to_id == user.id)
        )

    if priority:
        query = query.filter(Task.priority == priority)

    if search:
        query = query.filter(Task.title.ilike(f"%{search}%"))

    total_items = query.count()
    total_pages = math.ceil(total_items / page_size)
    offset = (page - 1) * page_size

    tasks = query.offset(offset).limit(page_size).all()

    return TaskPage(
        items=tasks,
        total_items=total_items,
        total_pages=total_pages,
        page=page,
        page_size=page_size,
    )

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
