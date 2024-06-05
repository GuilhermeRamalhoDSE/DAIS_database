from ninja import Router, UploadedFile, File
from django.shortcuts import get_object_or_404
from typing import List, Optional
from dais.models.contributionds_models import ContributionDS
from dais.schemas.contributionds_schema import ContributionDSCreateSchema, ContributionDSOutSchema, ContributionDSUpdateSchema
from dais.models.timeslot_models import TimeSlot
from dais.models.campaignds_models import CampaignDS
from dais.models.group_models import Group
from dais.models.client_models import Client
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token
from django.http import Http404, FileResponse
import os
from django.core.files.storage import default_storage

contributionds_router = Router(tags=["Contributions"])

@contributionds_router.post("/", response={201: ContributionDSOutSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_contribution(request, contributionds_in: ContributionDSCreateSchema, file: UploadedFile = File(...)):
    user_info = get_user_info_from_token(request)
    time_slot = get_object_or_404(TimeSlot, id=contributionds_in.time_slot_id)
    campaign = get_object_or_404(CampaignDS, id=time_slot.period_id) 
    group = get_object_or_404(Group, id=campaign.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to add contribution to this time slot.")
    
    contributionds_data = {**contributionds_in.dict(exclude=['file_path']), 'file':file}

    contributionds = ContributionDS.objects.create(**contributionds_data)

    contributionds_schema = ContributionDSOutSchema.from_orm(contributionds)

    return 201, contributionds_schema

@contributionds_router.get("/", response=List[ContributionDSOutSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_contributionds(request, time_slot_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    time_slot = get_object_or_404(TimeSlot, id=time_slot_id)
    campaign = get_object_or_404(CampaignDS, id=time_slot.period_id) 
    group = get_object_or_404(Group, id=campaign.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to view contributions.")

    query = ContributionDS.objects.all()
    if time_slot_id is not None:
        query = query.filter(time_slot_id=time_slot_id)
    
    contributions = [ContributionDSOutSchema.from_orm(contribution) for contribution in query]

    return contributions

@contributionds_router.get('/{contributionds_id}', response=ContributionDSOutSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_contributionds_by_id(request, contributionds_id: int):
    user_info = get_user_info_from_token(request)
    contributionds = get_object_or_404(ContributionDS, id=contributionds_id)
    time_slot = get_object_or_404(TimeSlot, id=contributionds.time_slot_id)
    campaign = get_object_or_404(CampaignDS, id=time_slot.period_id) 
    group = get_object_or_404(Group, id=campaign.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to view this contribution.")
    
    return ContributionDSOutSchema.from_orm(contributionds)

@contributionds_router.get('/download/{contributionds_id}', auth=[QueryTokenAuth(), HeaderTokenAuth()])
def download_contributionds_file(request, contributionds_id: int):
    user_info = get_user_info_from_token(request)
    contributionds = get_object_or_404(ContributionDS, id=contributionds_id)
    time_slot = get_object_or_404(TimeSlot, id=contributionds.time_slot_id)
    campaign = get_object_or_404(CampaignDS, id=time_slot.period_id) 
    group = get_object_or_404(Group, id=campaign.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to download this contribution.")

    if contributionds.file and hasattr(contributionds.file, 'path'):
        file_path = contributionds.file.path
        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=os.path.basename(file_path))
        else:
            raise Http404("File does not exist.")
    else:
        raise Http404("No file associated with this contribution")    

@contributionds_router.put("/{contributionds_id}", response=ContributionDSOutSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_contribution(request, contributionds_id: int, contributionds_in: ContributionDSCreateSchema, file: UploadedFile = File(None)):
    user_info = get_user_info_from_token(request)
    contributionds = get_object_or_404(ContributionDS, id=contributionds_id)
    time_slot = get_object_or_404(TimeSlot, id=contributionds.time_slot_id)
    campaign = get_object_or_404(CampaignDS, id=time_slot.period_id) 
    group = get_object_or_404(Group, id=campaign.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to update contributions.")

    for attr, value in contributionds_in.dict(exclude_none=True).items():
        setattr(contributionds, attr, value)
    
    if file:
        if contributionds.file and default_storage.exists(contributionds.file.name):
            default_storage.delete(contributionds.logo.name)
        contributionds.file = file

    contributionds.save()
    return contributionds

@contributionds_router.delete("/{contributionds_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_contribution(request, contributionds_id: int):
    user_info = get_user_info_from_token(request)
    contributionds = get_object_or_404(ContributionDS, id=contributionds_id)
    time_slot = get_object_or_404(TimeSlot, id=contributionds.time_slot_id)
    campaign = get_object_or_404(CampaignDS, id=time_slot.period_id) 
    group = get_object_or_404(Group, id=campaign.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to delete contributions.")
    
    if contributionds.file:
        file_path = contributionds.file.path
        if os.path.exists(file_path):
            os.remove(file_path)
            
    contributionds.delete()
    return 204, None
