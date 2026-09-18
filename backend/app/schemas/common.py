# Common Pydantic response schemas
# Used for standardizing API responses across FinGuard

from pydantic import BaseModel
from typing import Optional, Any


class HealthResponse(BaseModel):
    status: str
    service: str


class RootResponse(BaseModel):
    message: str


class PlaceholderResponse(BaseModel):
    status: str = "placeholder"
    message: str
    data: Optional[Any] = None
