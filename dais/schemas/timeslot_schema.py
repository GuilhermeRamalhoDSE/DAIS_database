from ninja import Schema
from datetime import time
from dais.schemas.periodds_schema import PeriodDSOut

class TimeSlotIn(Schema):
    period_id: int
    start_time: time
    end_time: time

class TimeSlotOut(Schema):
    id: int
    period: PeriodDSOut
    start_time: time
    end_time: time
