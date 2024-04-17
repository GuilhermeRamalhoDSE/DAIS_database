from django.shortcuts import get_object_or_404
from ninja import Router
from typing import List, Optional
from dais.models.contribution_models import Contribution
from dais.schemas.contribution_schema import ContributionIn, ContributionOut
from dais.models.timeslot_models import TimeSlot
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token, check_user_permission
from ninja.errors import HttpError

contribution_router = Router(tags=["Contributions"])

@contribution_router.post("/", response={201: ContributionOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_contribution(request, payload: ContributionIn):
    
    time_slot = get_object_or_404(TimeSlot, id=payload.time_slot_id)
    
    contribution = Contribution.objects.create(**payload.dict(), time_slot=time_slot)
    return 201, contribution

@contribution_router.get("/", response=List[ContributionOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_contributions(request, time_slot_id: Optional[int] = None):

    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view these contributions.")

    if time_slot_id:
        time_slot = get_object_or_404(TimeSlot, id=time_slot_id)
        contributions = Contribution.objects.filter(time_slot=time_slot)
    else:
        raise HttpError(400, "Time Slot ID is required.")

    return contributions


@contribution_router.post("/{contribution_id}/set-random/", auth=[QueryTokenAuth(), HeaderTokenAuth()])
def set_random(request, contribution_id: int):
    contribution = get_object_or_404(Contribution, id=contribution_id)
    contribution.is_random = True
    contribution.save()
    return {"message": "Contribution set to random order."}

@contribution_router.post("/{contribution_id}/unset-random/", auth=[QueryTokenAuth(), HeaderTokenAuth()])
def unset_random(request, contribution_id: int):
    contribution = get_object_or_404(Contribution, id=contribution_id)
    contribution.is_random = False
    contribution.save()
    return {"message": "Contribution set to sequential order."}

@contribution_router.put("/{contribution_id}", response=ContributionOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_contribution(request, contribution_id: int, payload: ContributionIn):
    contribution = get_object_or_404(Contribution, id=contribution_id)
    
    if payload.time_slot_id is not None:
        contribution.time_slot_id = payload.time_slot_id
    
    contribution.save()
    return contribution

@contribution_router.delete("/{contribution_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_contribution(request, contribution_id: int):
    contribution = get_object_or_404(Contribution, id=contribution_id)
    contribution.delete()
    return {"message": "Contribution deleted successfully"}
