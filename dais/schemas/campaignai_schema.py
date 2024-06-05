from datetime import date, datetime
from ninja import Schema
from typing import Optional
from dais.schemas.group_schema import GroupOut

class CampaignAICreate(Schema):
    group_id: int
    start_date: date
    end_date: date
    active: bool

class CampaignAIUpdate(Schema):
    group_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    active: Optional[bool] = None

class CampaignAIOut(Schema):
    id: int
    group: GroupOut
    start_date: date
    end_date: date
    last_update: datetime
    active: bool
