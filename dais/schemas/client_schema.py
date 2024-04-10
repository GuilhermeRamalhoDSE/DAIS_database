from ninja import Schema
from typing import Optional

class ClientIn(Schema):
    name: str
    email: str
    address: str
    phone: str
    active: bool = True  


class ClientOut(Schema):
    id: int
    name: str
    email: str
    address: str
    phone: str
    license_id: int
    active: bool 
