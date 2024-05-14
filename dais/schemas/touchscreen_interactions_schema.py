from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TouchScreenInteractionsCreateSchema(BaseModel):
    cliente_module_id: int
    name: str

class TouchScreenInteractionsUpdateSchema(BaseModel):
    client_module_id: Optional[int] = None
    name: Optional[str] = None

class TouchScreenInteractionsSchema(BaseModel):
    id: int
    client_module_id: int
    name: str
    total_buttons: int
    last_update: datetime

    class Config:
        from_attributes = True

    @staticmethod
    def resolve_total_buttons(obj):
        return obj.total_buttons  
