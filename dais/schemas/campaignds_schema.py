from datetime import date
from ninja import Schema
from typing import Optional
from dais.schemas.group_schema import GroupOut
from datetime import datetime

class CampaignDSCreate(Schema):
    name: str
    group_id: int
    start_date: date
    end_date: date
    active: bool

class CampaignDSUpdate(Schema):
    name: Optional[str] = None
    group_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    active: Optional[bool] = None

class CampaignDSOut(Schema):
    id: int
    name: str
    group: GroupOut
    start_date: date
    end_date: date
    last_update: datetime
    active: bool
    
