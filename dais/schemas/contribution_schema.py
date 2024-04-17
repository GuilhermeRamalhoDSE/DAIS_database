from ninja import Schema
from typing import Optional
from dais.schemas.timeslot_schema import TimeSlotOut

class ContributionIn(Schema):
    time_slot_id: Optional[int] = None

class ContributionOut(Schema):
    id: int
    time_slot: TimeSlotOut
    detail_count: int

    @staticmethod
    def resolve_time_slot_id(obj):
        return obj.time_slot.id

    @staticmethod
    def resolve_detail_count(obj):
        return obj.detail_count

