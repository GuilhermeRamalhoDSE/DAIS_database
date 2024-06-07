from ninja import Router
from typing import List, Optional
from django.shortcuts import get_object_or_404
from dais.models.timeslot_models import TimeSlot
from dais.models.campaignds_models import CampaignDS
from dais.models.group_models import Group
from dais.models.client_models import Client
from dais.schemas.timeslot_schema import TimeSlotOutSchema, TimeSlotCreateSchema, TimeSlotUpdateSchema
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token
from django.http import Http404

timeslot_router = Router(tags=["TimeSlots"])

@timeslot_router.post("/", response={201: TimeSlotOutSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_timeslot(request, timeslot_in: TimeSlotCreateSchema):
    user_info = get_user_info_from_token(request)
    campaignds = get_object_or_404(CampaignDS, id=timeslot_in.campaignds_id) 
    group = get_object_or_404(Group, id=campaignds.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to add time slots.")
    
    timeslot_data = {**timeslot_in.dict()}

    timeslot = TimeSlot.objects.create(**timeslot_data)

    timeslot_schema = TimeSlotOutSchema.from_orm(timeslot)

    return timeslot_schema

@timeslot_router.post("/{timeslot_id}/set-random/", auth=[QueryTokenAuth(), HeaderTokenAuth()])
def set_random(request, timeslot_id: int):
    user_info = get_user_info_from_token(request)
    time_slot = get_object_or_404(TimeSlot, id=timeslot_id)
    campagn = get_object_or_404(CampaignDS, id=time_slot.campaignds_id) 
    group = get_object_or_404(Group, id=campagn.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to set time slots random.")
    
    time_slot.is_random = True
    time_slot.save()
    return {"message": "Contribution set to random order."}

@timeslot_router.post("/{timeslot_id}/unset-random/", auth=[QueryTokenAuth(), HeaderTokenAuth()])
def unset_random(request, timeslot_id: int):
    user_info = get_user_info_from_token(request)
    time_slot = get_object_or_404(TimeSlot, id=timeslot_id)
    campaignds = get_object_or_404(CampaignDS, id=time_slot.campaignds_id) 
    group = get_object_or_404(Group, id=campaignds.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to unset time slots random.")
    
    time_slot.is_random = False
    time_slot.save()
    return {"message": "Contribution set to sequential order."}

@timeslot_router.get("/", response=List[TimeSlotOutSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_timeslots(request, campaignds_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    campagn = get_object_or_404(CampaignDS, id=campaignds_id) 
    group = get_object_or_404(Group, id=campagn.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to view time slots.")
    
    query = TimeSlot.objects.all()
    if campaignds_id is not None:
        query = TimeSlot.objects.filter(campaignds_id=campaignds_id).order_by('id')
    
    timeslots = [TimeSlotOutSchema.from_orm(timeslot) for timeslot in query]
    return timeslots

@timeslot_router.get("/{timeslot_id}", response=TimeSlotOutSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_timeslot(request, timeslot_id: int):
    user_info = get_user_info_from_token(request)
    time_slot = get_object_or_404(TimeSlot, id=timeslot_id)
    campagn = get_object_or_404(CampaignDS, id=time_slot.campaignds_id) 
    group = get_object_or_404(Group, id=campagn.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to view this time slot.")
    
    return TimeSlotOutSchema.from_orm(time_slot)

@timeslot_router.put("/{timeslot_id}", response=TimeSlotOutSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_timeslot(request, timeslot_id: int, timeslot_in: TimeSlotUpdateSchema):
    user_info = get_user_info_from_token(request)
    time_slot = get_object_or_404(TimeSlot, id=timeslot_id)
    campagn = get_object_or_404(CampaignDS, id=time_slot.campaignds_id) 
    group = get_object_or_404(Group, id=campagn.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to update this time slot.")
    
    for attr, value in timeslot_in.dict(exclude_none=True).items():
        setattr(time_slot, attr, value)

    time_slot.save()
    return time_slot

@timeslot_router.delete("/{timeslot_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_timeslot(request, timeslot_id: int):
    user_info = get_user_info_from_token(request)
    time_slot = get_object_or_404(TimeSlot, id=timeslot_id)
    campagn = get_object_or_404(CampaignDS, id=time_slot.campaignds_id) 
    group = get_object_or_404(Group, id=campagn.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to delete this time slot.")
    
    time_slot.delete()
    return 204, None

