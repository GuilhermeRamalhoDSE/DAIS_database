from typing import List, Optional
from ninja import Router, File
from ninja.files import UploadedFile
from django.http import HttpRequest, Http404
from django.shortcuts import get_object_or_404
from dais.models.campaignai_models import CampaignAI  
from dais.models.group_models import Group
from dais.models.client_models import Client
from dais.schemas.campaignai_schema import CampaignAICreate, CampaignAIUpdate, CampaignAIOut  
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token
import os
from django.core.files.storage import default_storage
from django.db.models import Q
from ninja.errors import HttpError
from datetime import timedelta


campaignai_router = Router(tags=["CampaignAI"])  

def check_campaign_overlap(group_id, start_date, end_date, campaign_id=None):
    query = CampaignAI.objects.filter(
        Q(group_id=group_id) &
        Q(active=True) &
        (
            Q(start_date__lt=end_date + timedelta(days=1)) &
            Q(end_date__gt=start_date - timedelta(days=1))
        )
    )
    if campaign_id:
        query = query.exclude(id=campaign_id)
    return query.exists()

@campaignai_router.post("/", response={201: CampaignAIOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_campaignai(request: HttpRequest, campaign_in: CampaignAICreate, logo: UploadedFile = File(None), background: UploadedFile = File(None)):
    user_info = get_user_info_from_token(request)
    group = get_object_or_404(Group, id=campaign_in.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to add campaigns.")
    
    if check_campaign_overlap(group.id, campaign_in.start_date, campaign_in.end_date):
        raise HttpError(400, "A campaign already exists in this period.")
    
    campaign_data = {
        **campaign_in.dict(exclude={'background_path', 'logo_path'}),
        'background': background,
        'logo': logo
    }

    campaignai = CampaignAI.objects.create(**campaign_data)

    campaign_schema = CampaignAIOut.from_orm(campaignai)

    return 201, campaign_schema

@campaignai_router.get("/", response=List[CampaignAIOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_campaignais(request, group_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    group = get_object_or_404(Group, id=group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to view campaigns.")

    query = CampaignAI.objects.all()
    if group_id is not None:
        query = query.filter(group_id=group_id)

    campaigns = [CampaignAIOut.from_orm(campaign) for campaign in query]
    return campaigns

@campaignai_router.get("/{campaignai_id}", response={200: CampaignAIOut, 404: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_campaignai_by_id(request, campaignai_id: int):
    user_info = get_user_info_from_token(request)
    campaignai = get_object_or_404(CampaignAI, id=campaignai_id)
    group = get_object_or_404(Group, id=campaignai.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to view this campaign.")

    return CampaignAIOut.from_orm(campaignai)  

@campaignai_router.get("/with-dates/", response=List[CampaignAIOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_campaignai_with_dates(request, license_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    
    if not user_info.get('is_superuser') and str(user_info.get('license_id')) != str(license_id):
        raise Http404("You do not have permission to view campaigns for this license.")
    
    query = CampaignAI.objects.all()
    if license_id is not None:
        query = query.filter(group__client__license_id=license_id)

    campaigns = [CampaignAIOut.from_orm(campaign) for campaign in query]

    return campaigns    

@campaignai_router.get("/by-client/", response=List[CampaignAIOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_campaignai_by_client(request, client_id: int):
    user_info = get_user_info_from_token(request)
    client = get_object_or_404(Client, id=client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404("You do not have permission to view campaigns for this client.")

    query = CampaignAI.objects.filter(group__client_id=client_id)

    campaigns = [CampaignAIOut.from_orm(campaign) for campaign in query]
    return campaigns

@campaignai_router.put("/{campaignai_id}", response=CampaignAIOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_campaignai(request, campaignai_id: int, campaignai_in: CampaignAIUpdate, logo: UploadedFile = File(None), background: UploadedFile = File(None)):
    user_info = get_user_info_from_token(request)
    campaignai = get_object_or_404(CampaignAI, id=campaignai_id)
    group = get_object_or_404(Group, id=campaignai.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to update this campaign.")
    
    new_start_date = campaignai_in.start_date if campaignai_in.start_date else campaignai.start_date
    new_end_date = campaignai_in.end_date if campaignai_in.end_date else campaignai.end_date
    new_active_status = campaignai_in.active if campaignai_in.active is not None else campaignai.active

    if check_campaign_overlap(group.id, new_start_date, new_end_date, campaignai_id):
        raise HttpError(400, "A campaign already exists in this period.")

    if new_active_status and not campaignai.active:
        if check_campaign_overlap(group.id, new_start_date, new_end_date, campaignai_id):
            raise HttpError(400, "A campaign already exists in this period.")
    
    for attr, value in campaignai_in.dict(exclude_none=True).items():
        setattr(campaignai, attr, value)

    if logo:
        if campaignai.logo and default_storage.exists(campaignai.logo.name):
            default_storage.delete(campaignai.logo.name)
        campaignai.logo = logo

    if background:
        if campaignai.background and default_storage.exists(campaignai.background.name):
            default_storage.delete(campaignai.background.name)
        campaignai.background = background

    campaignai.save()
    return campaignai

@campaignai_router.delete("/{campaignai_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_campaignai(request, campaignai_id: int):
    user_info = get_user_info_from_token(request)
    campaignai = get_object_or_404(CampaignAI, id=campaignai_id)
    group = get_object_or_404(Group, id=campaignai.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to delete this campaign.")
    
    if campaignai.logo:
        logo_path = campaignai.logo.path
        if os.path.exists(logo_path):
            os.remove(logo_path)

    if campaignai.background:
        background_path = campaignai.background.path
        if os.path.exists(background_path):
            os.remove(background_path)

    campaignai.delete()
    return 204, None