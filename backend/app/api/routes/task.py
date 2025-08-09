
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.schemas.task import TaskCreate, TaskUpdate, TaskOut, PriorityEnum, TaskPage
from app.services import task_service
from app.api.deps import get_db, get_current_user
from app.db.models.user import User

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return task_service.create_task(db=db, task=task, user_id=current_user.id)

@router.get("/", response_model=TaskPage)
def read_tasks(
    page: int = 1,
    page_size: int = 10,
    priority: PriorityEnum = None,
    search: str = None,
    user_email: str = None,
    assigned_to_me: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tasks_page = task_service.get_tasks(
        db,
        user=current_user,
        page=page,
        page_size=page_size,
        priority=priority,
        search=search,
        user_email=user_email,
        assigned_to_me=assigned_to_me,
    )
    return tasks_page

@router.get("/{task_id}", response_model=TaskOut)
def read_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_task = task_service.get_task(db, task_id=task_id, user=current_user)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@router.put("/{task_id}", response_model=TaskOut)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_task = task_service.update_task(db, task_id=task_id, task_update=task, user=current_user)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_task = task_service.delete_task(db, task_id=task_id, user=current_user)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return
