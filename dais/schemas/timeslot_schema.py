from ninja import Schema
from datetime import time
from dais.schemas.campaignds_schema import CampaignDSOut

class TimeSlotIn(Schema):
    period_id: int
    start_time: time
    end_time: time

class TimeSlotOut(Schema):
    id: int
    period: CampaignDSOut
    start_time: time
    end_time: time
