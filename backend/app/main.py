from fastapi import FastAPI
from app.core.logging import setup_logging
from app.core.config import settings
from app.api.routes import health

setup_logging()

app = FastAPI(
    title="Task Manager - Backend - FastAPI",
    description="REST API for an task manager api",
    version="1.0.0"
)

app.include_router(health.router, prefix=settings.API_V1_STR)

@app.get(settings.API_V1_STR)
async def read_root():
    return {"message": "Welcome to Task Manage - Backend"}
