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
from django.db.models import Q
from ninja.errors import HttpError
from datetime import timedelta


campaignds_router = Router(tags=["CampaignDS"])

def check_campaign_overlap(group_id, start_date, end_date, campaign_id=None):
    query = CampaignDS.objects.filter(
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

@campaignds_router.post("/", response={201: CampaignDSOut, 400: dict}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_campaignds(request: HttpRequest, campaign_in: CampaignDSCreate, logo: UploadedFile = File(None), background: UploadedFile = File(None)):
    user_info = get_user_info_from_token(request)
    group = get_object_or_404(Group, id=campaign_in.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise HttpError(404, "You do not have permission to add campaigns.")
    
    if check_campaign_overlap(group.id, campaign_in.start_date, campaign_in.end_date):
        raise HttpError(400, "A campaign already exists in this period.")

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

@campaignds_router.put("/{campaignds_id}", response={200: CampaignDSOut, 400: dict}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_campaignds(request, campaignds_id: int, campaignds_in: CampaignDSUpdate, logo: UploadedFile = File(None), background: UploadedFile = File(None)):
    user_info = get_user_info_from_token(request)
    campaignds = get_object_or_404(CampaignDS, id=campaignds_id)
    group = get_object_or_404(Group, id=campaignds.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise HttpError(404, "You do not have permission to update this campaign.")
    
    new_start_date = campaignds_in.start_date if campaignds_in.start_date else campaignds.start_date
    new_end_date = campaignds_in.end_date if campaignds_in.end_date else campaignds.end_date
    new_active_status = campaignds_in.active if campaignds_in.active is not None else campaignds.active

    if check_campaign_overlap(group.id, new_start_date, new_end_date, campaignds_id):
        raise HttpError(400, "A campaign already exists in this period.")

    if new_active_status and not campaignds.active:
        if check_campaign_overlap(group.id, new_start_date, new_end_date, campaignds_id):
            raise HttpError(400, "A campaign already exists in this period.")

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
    return CampaignDSOut.from_orm(campaignds)

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
