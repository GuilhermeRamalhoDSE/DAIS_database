from pydantic import BaseModel
from typing import Optional

class ClientModuleCreateSchema(BaseModel):
    client_id: int
    name: str

class ClientModuleUpdateSchema(BaseModel):
    client_id: Optional[int] = None
    name: Optional[str] = None

class ClientModuleSchema(BaseModel):
    id: int
    client_id: int
    name: str
    form_count: int

    class Config:
        from_attributes = True