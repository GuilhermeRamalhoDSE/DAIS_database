from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class FormCreateSchema(BaseModel):
    client_id: int
    module_id: int
    name: str
    api: bool

class FormUpdateSchema(BaseModel):
    client_id: Optional[int] = None
    module_id: Optional[int] = None
    name: Optional[str] = None
    api: Optional[bool] = None

class FormSchema(BaseModel):
    id: int
    client_id: int
    client_name: str
    module_id: int
    name: str
    api: bool
    last_update: datetime
