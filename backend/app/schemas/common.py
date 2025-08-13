from pydantic import BaseModel, Field
from typing import TypeVar, Generic, List

T = TypeVar('T')

class QueryParams(BaseModel):
    page: int = Field(1, ge=1, description="Page number")
    page_size: int = Field(10, ge=1, le=100, description="Page size")

class Page(BaseModel, Generic[T]):
    items: List[T]
    total_items: int
    total_pages: int
    page: int
    page_size: int
