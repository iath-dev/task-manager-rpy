from fastapi import FastAPI
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.core.logging import setup_logging
from app.core.config import settings

from app.api.v1.api import api_router

from contextlib import asynccontextmanager

from app.db.base import Base
from app.db.session import engine, engine

setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])

app = FastAPI(
    title="Task Manager - Backend - FastAPI",
    description="REST API for an task manager api",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_exception_handler(429, _rate_limit_exceeded_handler)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get(settings.API_V1_STR, tags=["root"])
async def read_root():
    return {"message": "Welcome to Task Manage - Backend"}
