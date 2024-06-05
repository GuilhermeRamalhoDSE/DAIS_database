from pydantic import BaseModel
from datetime import time
from typing import Optional
from dais.schemas.campaignds_schema import CampaignDSOut

class TimeSlotCreateSchema(BaseModel):
    campaign_id: int
    start_time: time
    end_time: time

class TimeSlotUpdateSchema(BaseModel):
    campaign_id: Optional[int] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None

class TimeSlotOutSchema(BaseModel):
    id: int
    campaign: CampaignDSOut
    start_time: time
    end_time: time
    contributionds_count: int
    is_random: bool

    @staticmethod
    def resolve_contributionds_count(obj):
        return obj.contributionds_count
