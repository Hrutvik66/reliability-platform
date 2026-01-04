from pydantic import BaseModel, HttpUrl
from typing import Optional
from uuid import UUID

class ServiceBase(BaseModel):
    name: str
    url: HttpUrl
    check_interval: int = 5
    timeout: int = 5
    is_active: bool = True


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    url: Optional[HttpUrl] = None
    check_interval: Optional[int] = None
    timeout: Optional[int] = None
    is_active: Optional[bool] = None


class ServiceResponse(ServiceBase):
    id: UUID

    model_config = {
        "from_attributes": True  # 🔥 REQUIRED in Pydantic v2
    }
