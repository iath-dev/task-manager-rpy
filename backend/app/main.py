from fastapi import FastAPI
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware

from app.core.logging import setup_logging
from app.core.config import settings

from app.api.v1.api import api_router

from app.db.base import Base
from app.db.session import engine

setup_logging()

Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

app = FastAPI(
    title="Task Manager - Backend - FastAPI",
    description="REST API for an task manager api",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_exception_handler(429, _rate_limit_exceeded_handler)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get(settings.API_V1_STR, tags=["root"])
async def read_root():
    return {"message": "Welcome to Task Manage - Backend"}
