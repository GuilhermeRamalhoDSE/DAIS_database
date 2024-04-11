from ninja import Schema
from typing import Optional
from datetime import date

class TotemCreate(Schema):
    license_id: int
    client_id: int
    group_id: int
    installation_date: date
    active: bool
    screens: int
    comments: Optional[str] = None

class TotemUpdate(Schema):
    license_id: Optional[int] = None
    client_id: Optional[int] = None
    group_id: Optional[int] = None
    installation_date: Optional[date] = None
    active: Optional[bool] = None
    screens: Optional[int] = None
    comments: Optional[str] = None

class TotemOut(Schema):
    id: int
    license_id: int
    client_id: int
    group_id: int
    installation_date: date
    active: bool
    screens: int
    comments: Optional[str] = None
