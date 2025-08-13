from fastapi import APIRouter, status

from app.db.session import check_database

router = APIRouter()

@router.get('/health', tags=["Health"], summary="Health Check", description="Check database connection status.", status_code=status.HTTP_200_OK)
def health_check():
    """
    Check database status
    """
    db_ok = check_database()
    return {
        "status": "ok" if db_ok else "error"
    }