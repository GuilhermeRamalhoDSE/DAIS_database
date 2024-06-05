from ninja import Router
from typing import List, Optional
from django.shortcuts import get_object_or_404
from dais.models.campaignai_models import CampaignAI  
from dais.models.group_models import Group
from dais.schemas.campaignai_schema import CampaignAICreate, CampaignAIUpdate, CampaignAIOut  
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token, check_user_permission
from ninja.errors import HttpError

periodia_router = Router(tags=["CampaignAI"])  

@periodia_router.post("/", response={201: CampaignAIOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_periodia(request, payload: CampaignAICreate):
    user_info = get_user_info_from_token(request)
    is_superuser = check_user_permission(request)

    if not is_superuser:
        raise HttpError(403, "You do not have permission to create a periodia.")
    
    group = get_object_or_404(Group, id=payload.group_id)

    periodia = CampaignAI.objects.create(**payload.dict())  

    return 201, periodia

@periodia_router.get("/", response=List[CampaignAIOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_periodias(request, group_id: Optional[int] = None):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view these periodias.")

    if group_id:
        periods_query = CampaignAI.objects.filter(group_id=group_id)  
    else:
        periods_query = CampaignAI.objects.all()
    
    periods = [CampaignAIOut.from_orm(period) for period in periods_query]

    return periods

@periodia_router.get("/{periodia_id}", response={200: CampaignAIOut, 404: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_periodia_by_id(request, periodia_id: int):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view this periodia.")

    periodia = get_object_or_404(CampaignAI, id=periodia_id)  
    return periodia

@periodia_router.put("/{periodia_id}", response=CampaignAIOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_periodia(request, periodia_id: int, payload: CampaignAIUpdate):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to update this periodia.")
    
    periodia = get_object_or_404(CampaignAI, id=periodia_id)  

    for attribute, value in payload.dict(exclude_none=True).items():
        setattr(periodia, attribute, value)

    periodia.save()
    return periodia

@periodia_router.delete("/{periodia_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_periodia(request, periodia_id: int):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to delete this periodia.")
    
    periodia = get_object_or_404(CampaignAI, id=periodia_id) 

    periodia.delete()
    return 204, None
