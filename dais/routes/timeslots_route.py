from ninja import Router
from typing import List, Optional
from django.shortcuts import get_object_or_404
from dais.models.timeslot_models import TimeSlot
from dais.models.campaignds_models import CampaignDS
from dais.schemas.timeslot_schema import TimeSlotIn, TimeSlotOut
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token
from django.http import Http404

timeslot_router = Router(tags=["TimeSlots"])

@timeslot_router.post("/", response={201: TimeSlotOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_timeslot(request, payload: TimeSlotIn):
    user_info = get_user_info_from_token(request)
    period = get_object_or_404(CampaignDS, id=payload.period_id)

    if not user_info.get('is_superuser') and str(period.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to add time slots.")
    
    timeslot = TimeSlot.objects.create(
        period=period,
        start_time=payload.start_time,
        end_time=payload.end_time
    )
    return timeslot

@timeslot_router.get("/", response=List[TimeSlotOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_timeslots(request, periodds_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    period = get_object_or_404(CampaignDS, id=periodds_id)

    if not user_info.get('is_superuser') and str(period.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to view time slots.")
    
    query = TimeSlot.objects.all()
    if periodds_id is not None:
        query = TimeSlot.objects.filter(period_id=periodds_id).order_by('id')
    
    timeslots = [TimeSlotOut.from_orm(timeslot) for timeslot in query]
    return timeslots

@timeslot_router.get("/{timeslot_id}", response=TimeSlotOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_timeslot(request, timeslot_id: int):
    user_info = get_user_info_from_token(request)
    timeslot = get_object_or_404(TimeSlot, id=timeslot_id)
    period = get_object_or_404(CampaignDS, id=timeslot.period_id)

    if not user_info.get('is_superuser') and str(period.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to view this time slot.")
    
    return TimeSlotOut.from_orm(timeslot)

@timeslot_router.put("/{timeslot_id}", response=TimeSlotOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_timeslot(request, timeslot_id: int, payload: TimeSlotIn):
    user_info = get_user_info_from_token(request)
    timeslot = get_object_or_404(TimeSlot, id=timeslot_id)
    period = get_object_or_404(CampaignDS, id=timeslot.period_id)

    if not user_info.get('is_superuser') and str(period.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to update this time slot.")
    
    timeslot.start_time = payload.start_time
    timeslot.end_time = payload.end_time
    timeslot.save()
    return timeslot

@timeslot_router.delete("/{timeslot_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_timeslot(request, timeslot_id: int):
    user_info = get_user_info_from_token(request)
    timeslot = get_object_or_404(TimeSlot, id=timeslot_id)
    period = get_object_or_404(CampaignDS, id=timeslot.period_id)

    if not user_info.get('is_superuser') and str(period.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to delete this time slot.")
    
    timeslot.delete()
    return 204, None

