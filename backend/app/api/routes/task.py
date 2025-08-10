
from fastapi import HTTPException, status, Depends, APIRouter
from sqlalchemy.orm import Session

from app.schemas.task import TaskCreate, TaskUpdate, TaskOut, PriorityEnum, TaskPage, TaskStatistics, TaskQueryParams
from app.services import task_service
from app.api.deps import get_db, get_current_user
from app.db.models.user import User

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return task_service.create_task(db=db, task=task, user_id=current_user.id)

@router.get("/statistics", response_model=TaskStatistics)
def get_task_statistics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Get task statistics (total, completed, pending, and percentages).
    """
    return task_service.get_task_statistics(db, current_user)

@router.get("/", response_model=TaskPage)
def read_tasks(
    query_params: TaskQueryParams = Depends(),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tasks_page = task_service.get_tasks(
        db,
        user=current_user,
        query_params=query_params,
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
