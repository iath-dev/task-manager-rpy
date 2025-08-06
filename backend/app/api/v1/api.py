from fastapi import APIRouter
from app.api.routes import health, user

api_router = APIRouter()

api_router.include_router(user.router)
api_router.include_router(health.router)