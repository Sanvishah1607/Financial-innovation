# Common Pydantic response schemas
# Used for standardizing API responses across FinGuard

from pydantic import BaseModel
from typing import Optional, Any


class HealthResponse(BaseModel):
    status: str
    app_name: str
    service: str
    version: str
    environment: str


class RootResponse(BaseModel):
    message: str
    status: str = "running"
    app_name: str = "FinShield API"


class PlaceholderResponse(BaseModel):
    status: str = "placeholder"
    message: str
    data: Optional[Any] = None
