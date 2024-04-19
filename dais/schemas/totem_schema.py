from ninja import Schema
from typing import Optional
from datetime import date

class TotemCreate(Schema):
    group_id: int
    name: str
    installation_date: date
    active: bool
    comments: Optional[str] = None

class TotemUpdate(Schema):
    name: Optional[str] = None
    group_id: Optional[int] = None
    installation_date: Optional[date] = None
    active: Optional[bool] = None
    comments: Optional[str] = None

class TotemOut(Schema):
    id: int
    group_id: int
    name: str
    installation_date: date
    active: bool
    screens_count: int 
    comments: Optional[str] = None

    @staticmethod
    def resolve_screens_count(obj):
        return obj.screens_count
