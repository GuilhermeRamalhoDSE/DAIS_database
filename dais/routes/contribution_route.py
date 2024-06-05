from django.shortcuts import get_object_or_404
from ninja import Router
from typing import List, Optional
from dais.models.contribution_models import Contribution
from dais.schemas.contribution_schema import ContributionIn, ContributionOut
from dais.models.timeslot_models import TimeSlot
from dais.models.campaignds_models import CampaignDS
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token, check_user_permission
from ninja.errors import HttpError
from django.http import Http404

contribution_router = Router(tags=["Contributions"])

@contribution_router.post("/", response={201: ContributionOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_contribution(request, payload: ContributionIn):
    user_info = get_user_info_from_token(request)
    time_slot = get_object_or_404(TimeSlot, id=payload.time_slot_id)
    period = get_object_or_404(CampaignDS, id=time_slot.period_id) 

    if not user_info.get('is_superuser') and str(period.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to add contribution to this time slot.")
       
    contribution = Contribution.objects.create(**payload.dict(), time_slot=time_slot)
    return 201, contribution

@contribution_router.get("/", response=List[ContributionOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_contributions(request, time_slot_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    time_slot = get_object_or_404(TimeSlot, id=time_slot_id)
    period = get_object_or_404(CampaignDS, id=time_slot.period_id) 

    if not user_info.get('is_superuser') and str(period.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to view contributions.")

    query = Contribution.objects.all()
    if time_slot_id is not None:
        query = query.filter(time_slot_id=time_slot_id)
    
    contributions = [ContributionOut.from_orm(contribution) for contribution in query]

    return contributions

@contribution_router.post("/{contribution_id}/set-random/", auth=[QueryTokenAuth(), HeaderTokenAuth()])
def set_random(request, contribution_id: int):
    user_info = get_user_info_from_token(request)
    contribution = get_object_or_404(Contribution, id=contribution_id)
    time_slot = get_object_or_404(TimeSlot, id=contribution.time_slot_id)
    period = get_object_or_404(CampaignDS, id=time_slot.period_id) 

    if not user_info.get('is_superuser') and str(period.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to set contributions random.")
    
    contribution.is_random = True
    contribution.save()
    return {"message": "Contribution set to random order."}

@contribution_router.post("/{contribution_id}/unset-random/", auth=[QueryTokenAuth(), HeaderTokenAuth()])
def unset_random(request, contribution_id: int):
    user_info = get_user_info_from_token(request)
    contribution = get_object_or_404(Contribution, id=contribution_id)
    time_slot = get_object_or_404(TimeSlot, id=contribution.time_slot_id)
    period = get_object_or_404(CampaignDS, id=time_slot.period_id) 

    if not user_info.get('is_superuser') and str(period.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to unset contributions random.")
    
    contribution.is_random = False
    contribution.save()
    return {"message": "Contribution set to sequential order."}

@contribution_router.put("/{contribution_id}", response=ContributionOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_contribution(request, contribution_id: int, payload: ContributionIn):
    user_info = get_user_info_from_token(request)
    contribution = get_object_or_404(Contribution, id=contribution_id)
    time_slot = get_object_or_404(TimeSlot, id=contribution.time_slot_id)
    period = get_object_or_404(CampaignDS, id=time_slot.period_id) 

    if not user_info.get('is_superuser') and str(period.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to update contributions.")
    
    if payload.time_slot_id is not None:
        contribution.time_slot_id = payload.time_slot_id
    
    contribution.save()
    return contribution

@contribution_router.delete("/{contribution_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_contribution(request, contribution_id: int):
    user_info = get_user_info_from_token(request)
    contribution = get_object_or_404(Contribution, id=contribution_id)
    time_slot = get_object_or_404(TimeSlot, id=contribution.time_slot_id)
    period = get_object_or_404(CampaignDS, id=time_slot.period_id) 

    if not user_info.get('is_superuser') and str(period.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to delete contributions.")
    
    contribution.delete()
    return 204, None
