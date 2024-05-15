from ninja import Schema
from typing import Optional
from datetime import datetime


class TouchScreenInteractionsCreateSchema(Schema):
    client_module_id: int
    name: str

class TouchScreenInteractionsUpdateSchema(Schema):
    client_module_id: Optional[int] = None
    name: Optional[str] = None

class TouchScreenInteractionsSchema(Schema):
    id: int
    client_module_id: int
    name: str
    total_buttons: int
    last_update: datetime

    @staticmethod
    def resolve_total_buttons(obj):
        return obj.total_buttons 
    
    class Config:
        from_attributes = True

 
