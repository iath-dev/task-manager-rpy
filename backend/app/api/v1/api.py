from fastapi import APIRouter
from app.api.routes import health, user, auth, seed, task

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(user.router)
api_router.include_router(health.router)
api_router.include_router(task.router)
