from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class FormCreateSchema(BaseModel):
    client_module_id: int
    name: str
    api: bool

class FormUpdateSchema(BaseModel):
    client_module_id: Optional[int] = None
    name: Optional[str] = None
    api: Optional[bool] = None

class FormSchema(BaseModel):
    id: int
    client_module_id: int
    name: str
    api: bool
    last_update: datetime

    class Config:
        from_attributes = True