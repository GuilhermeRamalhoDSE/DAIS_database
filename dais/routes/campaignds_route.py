from typing import List, Optional
from ninja import Router, File
from ninja.files import UploadedFile
from django.http import HttpRequest, Http404
from django.shortcuts import get_object_or_404
from dais.models.campaignds_models import CampaignDS
from dais.models.group_models import Group
from dais.models.client_models import Client
from dais.schemas.campaignds_schema import CampaignDSCreate, CampaignDSUpdate, CampaignDSOut
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token
import os
from django.core.files.storage import default_storage

campaignds_router = Router(tags=["CampaignDS"])

@campaignds_router.post("/", response={201: CampaignDSOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_campaignds(request: HttpRequest, campaign_in: CampaignDSCreate, logo: UploadedFile = File(None), background: UploadedFile = File(None)):
    user_info = get_user_info_from_token(request)
    group = get_object_or_404(Group, id=campaign_in.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to add campaigns.")
    
    campaign_data = {
        **campaign_in.dict(exclude={'background_path', 'logo_path'}),
        'background': background,
        'logo': logo
    }

    campaignds = CampaignDS.objects.create(**campaign_data)

    campaign_schema = CampaignDSOut.from_orm(campaignds)

    return 201, campaign_schema

@campaignds_router.get("/", response=List[CampaignDSOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_campaignds(request, group_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    group = get_object_or_404(Group, id=group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to view campaigns.")

    query = CampaignDS.objects.all()
    if group_id is not None:
        query = query.filter(group_id=group_id)

    campaigns = [CampaignDSOut.from_orm(campaign) for campaign in query]
    return campaigns

@campaignds_router.get("/{campaignds_id}", response= CampaignDSOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_campaignds_by_id(request, campaignds_id: int):
    user_info = get_user_info_from_token(request)
    campaignds = get_object_or_404(CampaignDS, id=campaignds_id)
    group = get_object_or_404(Group, id=campaignds.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to view this campaign.")

    return CampaignDSOut.from_orm(campaignds)

@campaignds_router.get("/with-dates/", response=List[CampaignDSOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_campaignds_with_dates(request, license_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    
    if not user_info.get('is_superuser') and str(user_info.get('license_id')) != str(license_id):
        raise Http404("You do not have permission to view campaigns for this license.")
    
    query = CampaignDS.objects.all()
    if license_id is not None:
        query = query.filter(group__client__license_id=license_id)

    campaigns = [CampaignDSOut.from_orm(campaign) for campaign in query]

    return campaigns    

@campaignds_router.get("/by-client/", response=List[CampaignDSOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_campaignds_by_client(request, client_id: int):
    user_info = get_user_info_from_token(request)
    client = get_object_or_404(Client, id=client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404("You do not have permission to view campaigns for this client.")

    query = CampaignDS.objects.filter(group__client_id=client_id)

    campaigns = [CampaignDSOut.from_orm(campaign) for campaign in query]
    return campaigns

@campaignds_router.put("/{campaignds_id}", response=CampaignDSOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_campaignds(request, campaignds_id: int, campaignds_in: CampaignDSUpdate, logo: UploadedFile = File(None), background: UploadedFile = File(None)):
    user_info = get_user_info_from_token(request)
    campaignds = get_object_or_404(CampaignDS, id=campaignds_id)
    group = get_object_or_404(Group, id=campaignds.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to update this campaign.")
    
    for attr, value in campaignds_in.dict(exclude_none=True).items():
        setattr(campaignds, attr, value)

    if logo:
        if campaignds.logo and default_storage.exists(campaignds.logo.name):
            default_storage.delete(campaignds.logo.name)
        campaignds.logo = logo

    if background:
        if campaignds.background and default_storage.exists(campaignds.background.name):
            default_storage.delete(campaignds.background.name)
        campaignds.background = background

    campaignds.save()
    return campaignds

@campaignds_router.delete("/{campaignds_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_campaignds(request, campaignds_id: int):
    user_info = get_user_info_from_token(request)
    campaignds = get_object_or_404(CampaignDS, id=campaignds_id)
    group = get_object_or_404(Group, id=campaignds.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to delete this campaign.")
    
    if campaignds.logo:
        logo_path = campaignds.logo.path
        if os.path.exists(logo_path):
            os.remove(logo_path)

    if campaignds.background:
        background_path = campaignds.background.path
        if os.path.exists(background_path):
            os.remove(background_path)

    campaignds.delete()
    return 204, None
