from ninja import Schema
from datetime import datetime
from typing import Optional

class LogCreate(Schema):
    totem_id: int
    information: str

class LogOut(Schema):
    id: int
    totem_id: int
    totem_name: str
    date: datetime
    typology: str  
    information: str

    @staticmethod
    def resolve_totem_name(obj):
        return obj.totem.name if obj.totem else "Totem Deleted"


class LogCreateOut(Schema):
    id: int
    totem_id: int
    totem_name: Optional[str] = None
    date: datetime
    typology: str
    information: str