from ninja import Router
from typing import List, Optional
from datetime import time
from django.shortcuts import get_object_or_404
from dais.models.timeslot_models import TimeSlot
from dais.models.periodds_models import PeriodDS
from dais.schemas.timeslot_schema import TimeSlotIn, TimeSlotOut
from dais.auth import QueryTokenAuth, HeaderTokenAuth

timeslot_router = Router(tags=["TimeSlots"])

@timeslot_router.post("/", response={201: TimeSlotOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_timeslot(request, payload: TimeSlotIn):
    period = get_object_or_404(PeriodDS, id=payload.period_id)
    timeslot = TimeSlot.objects.create(
        period=period,
        start_time=payload.start_time,
        end_time=payload.end_time
    )
    return timeslot

@timeslot_router.get("/", response=List[TimeSlotOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_timeslots(request, period_id: Optional[int] = None):
    if period_id:
        timeslots = TimeSlot.objects.filter(period_id=period_id).order_by('id')
    else:
        timeslots = TimeSlot.objects.all().order_by('id')
    return [timeslot for timeslot in timeslots]

@timeslot_router.get("/{timeslot_id}", response=TimeSlotOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_timeslot(request, timeslot_id: int):
    timeslot = get_object_or_404(TimeSlot, id=timeslot_id)
    return timeslot

@timeslot_router.put("/{timeslot_id}", response=TimeSlotOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_timeslot(request, timeslot_id: int, payload: TimeSlotIn):
    timeslot = get_object_or_404(TimeSlot, id=timeslot_id)
    timeslot.start_time = payload.start_time
    timeslot.end_time = payload.end_time
    timeslot.save()
    return timeslot

@timeslot_router.delete("/{timeslot_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_timeslot(request, timeslot_id: int):
    timeslot = get_object_or_404(TimeSlot, id=timeslot_id)
    timeslot.delete()
    return None

