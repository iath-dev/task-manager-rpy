
from sqlalchemy.orm import Session
from typing import List, Optional
import math

from app.db.models.task import Task
from app.db.models.user import User, RoleEnum
from app.schemas.task import TaskCreate, TaskUpdate, PriorityEnum, TaskPage, TaskStatistics
from app.services import user_service
from sqlalchemy import func

def get_task(db: Session, task_id: int, user: User) -> Optional[Task]:
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return None
    # Corrected condition to use the ID fields for comparison
    if user.role == RoleEnum.admin or task.created_by_id == user.id or task.assigned_to_id == user.id:
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
    assigned_to_me: bool = False,
) -> TaskPage:
    query = db.query(Task)

    if assigned_to_me:
        query = query.filter(Task.assigned_to_id == user.id)
    elif user.role in [RoleEnum.admin, RoleEnum.super] and user_email:
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

    query = query.order_by(Task.created_at.desc())

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

def get_task_statistics(db: Session, user: User) -> TaskStatistics:
    query = db.query(Task)

    if user.role not in [RoleEnum.admin, RoleEnum.super]:
        query = query.filter(
            (Task.created_by_id == user.id) | (Task.assigned_to_id == user.id)
        )

    total_tasks = query.count()
    completed_tasks = query.filter(Task.completed == True).count()
    pending_tasks = total_tasks - completed_tasks

    completed_percentage = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0.0
    pending_percentage = (pending_tasks / total_tasks * 100) if total_tasks > 0 else 0.0

    return TaskStatistics(
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        pending_tasks=pending_tasks,
        completed_percentage=completed_percentage,
        pending_percentage=pending_percentage,
    )

def _assign_task_to_user(db: Session, task_data: dict):
    if "assigned_to" in task_data and task_data["assigned_to"] is not None:
        user_to_assign = user_service.get_user_by_email(db, email=task_data["assigned_to"])
        if user_to_assign:
            task_data["assigned_to_id"] = user_to_assign.id
        else:
            # Handle case where user is not found, maybe raise an exception
            pass
    if "assigned_to" in task_data:
        del task_data["assigned_to"]

def create_task(db: Session, task: TaskCreate, user_id: int) -> Task:
    task_data = task.model_dump()
    _assign_task_to_user(db, task_data)
    db_task = Task(**task_data, created_by_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task_update: TaskUpdate, user: User) -> Optional[Task]:
    db_task = get_task(db, task_id, user)
    if not db_task:
        return None

    update_data = task_update.model_dump(exclude_unset=True)
    _assign_task_to_user(db, update_data)

    for key, value in update_data.items():
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
