from typing import List, Optional
from ninja import Router, File
from ninja.files import UploadedFile
from django.http import HttpRequest, FileResponse, Http404
from django.shortcuts import get_object_or_404
from dais.models.campaignai_models import CampaignAI  
from dais.models.group_models import Group
from dais.models.client_models import Client
from dais.schemas.campaignai_schema import CampaignAICreate, CampaignAIUpdate, CampaignAIOut  
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token
import os
from django.core.files.storage import default_storage


campaignai_router = Router(tags=["CampaignAI"])  

@campaignai_router.post("/", response={201: CampaignAIOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_campaignai(request: HttpRequest, campaign_in: CampaignAICreate, logo: UploadedFile = File(None), background: UploadedFile = File(None)):
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

@campaignai_router.get('/download/logo/{campaignai_id}', auth=[QueryTokenAuth(), HeaderTokenAuth()])
def download_campaignai_logofile(request, campaignai_id: int):
    user_info = get_user_info_from_token(request)
    campaignai = get_object_or_404(CampaignAI, id=campaignai_id)
    group = get_object_or_404(Group, id=campaignai.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to download this logo from this campaign.")
    
    if campaignai.logo and hasattr(campaignai.logo, 'path'):
        logo_path = campaignai.logo.path
        if os.path.exists(logo_path):
            return FileResponse(open(logo_path, 'rb'), as_attachment=True, filename=os.path.basename(logo_path))
        else:
            raise Http404('No logo file associated with this campaign')

@campaignai_router.get('/download/background/{campaignai_id}', auth=[QueryTokenAuth(), HeaderTokenAuth()])
def download_campaignai_backgroundfile(request, campaignai_id: int):
    user_info = get_user_info_from_token(request)
    campaignai = get_object_or_404(CampaignAI, id=campaignai_id)
    group = get_object_or_404(Group, id=campaignai.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to download this background from this campaign.")
    
    if campaignai.background and hasattr(campaignai.background, 'path'):
        background_path = campaignai.background.path
        if os.path.exists(background_path):
            return FileResponse(open(background_path, 'rb'), as_attachment=True, filename=os.path.basename(background_path))
        else:
            raise Http404('No logo file associated with this campaign')      

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