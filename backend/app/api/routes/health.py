from fastapi import APIRouter

from app.db.session import check_database

router = APIRouter()

@router.get('/health', tags=["Health"])
def health_check():
    """
    Check database status
    """
    db_ok = check_database()
    return {
        "status": "ok" if db_ok else "error"
    }