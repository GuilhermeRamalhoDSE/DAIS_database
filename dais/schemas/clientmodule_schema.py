from pydantic import BaseModel
from typing import Optional
from dais.schemas.module_schema import ModuleOut

class ClientModuleCreateSchema(BaseModel):
    client_id: int
    name: str
    module_id: int

class ClientModuleUpdateSchema(BaseModel):
    client_id: Optional[int] = None
    name: Optional[str] = None
    module_id: Optional[int] = None

class ClientModuleSchema(BaseModel):
    id: int
    client_id: int
    name: str
    module: ModuleOut
    form_count: int

    class Config:
        from_attributes = True