from fastapi import APIRouter

from app.db.session import check_database

router = APIRouter()

@router.get('/health', tags=["Health"])
def health_check():
    db_ok = check_database()
    return {
        "status": "ok" if db_ok else "error"
    }