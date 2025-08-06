from fastapi import FastAPI

from app.core.logging import setup_logging
from app.core.config import settings

from app.api.v1.api import api_router

from app.db.base import Base
from app.db.session import engine

setup_logging()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Task Manager - Backend - FastAPI",
    description="REST API for an task manager api",
    version="1.0.0"
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get(settings.API_V1_STR, tags=["root"])
async def read_root():
    return {"message": "Welcome to Task Manage - Backend"}
