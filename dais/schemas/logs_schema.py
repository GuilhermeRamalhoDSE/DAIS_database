from ninja import Schema
from datetime import datetime

class LogCreate(Schema):
    license_id: int
    totem_id: int
    date: datetime
    typology: str  
    information: str
    client: str
    campaign: str
    logtype: str

class LogOut(Schema):
    id: int
    license_id: int
    totem_id: int
    date: datetime
    typology: str  
    information: str
    client: str
    campaign: str
    logtype: str

class LogCreateOut(Schema):
    id: int
    license_id: int
    totem_id: int
    date: datetime
    typology: str
    information: str
    client: str
    campaign: str
    logtype: str