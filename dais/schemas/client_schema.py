from ninja import Schema
from typing import Optional


class ClientIn(Schema):
    name: str
    email: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    active: Optional[bool] = True


class ClientOut(Schema):
    id: int
    name: str
    email: str
    address: str
    phone: str
    license_id: int
    active: bool 
