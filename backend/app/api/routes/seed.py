from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status

from app.services import user_service
from app.api.deps import get_db

router = APIRouter(prefix="/seed", tags=["Seed"])

@router.post("/", summary="Seed Data", description="Create initial data for the application (users, tasks, etc.).", status_code=status.HTTP_201_CREATED)
def seed_data(db: Session = Depends(get_db)):
    """
    Create initial data for the application.
    """
    try:
        user_service.seed_users(db)
        return {"message": "Data seeded successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
