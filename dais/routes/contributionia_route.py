from ninja import Router, UploadedFile, File
from django.shortcuts import get_object_or_404
from typing import List, Optional
from ninja.errors import HttpError
from dais.schemas.contributionia_schema import ContributionIACreateSchema, ContributionIAUpdateSchema, ContributionIASchema, LanguageOut, LayerOut
from dais.models.contributionia_models import ContributionIA
from dais.models.layer_models import Layer
from dais.models.campaignai_models import CampaignAI
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token, check_user_permission
from django.http import Http404, FileResponse
import os
from django.core.files.storage import default_storage

contributionia_router = Router(tags=["ContributionIA"])

@contributionia_router.post("/", response={201: ContributionIASchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_contribution(request, contribution_in: ContributionIACreateSchema, file: UploadedFile = File(...)):
    user_info = get_user_info_from_token(request)
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to add a contribution.")

    layer = get_object_or_404(Layer, id=contribution_in.layer_id)
    if not user_info.get('is_superuser') and str(layer.period.group.client.license_id) != str(user_info.get('license_id')):
        raise HttpError(403, "You do not have permission to add contributions to this layer.")
    
    contribution_data = {**contribution_in.dict(exclude={'file_path'}), 'file': file}

    contribution = ContributionIA.objects.create(**contribution_data)
    
    language_out = LanguageOut.from_orm(contribution.language)
    layer_out = LayerOut.from_orm(contribution.layer)
    
    contribution_schema = ContributionIASchema.from_orm(contribution)
    contribution_schema.language = language_out
    
    return 201, contribution_schema

@contributionia_router.get("/", response=List[ContributionIASchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_contributions(request, layer_id: Optional[int] = None):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view these contributions.")
    
    query = ContributionIA.objects.all()
    if layer_id is not None:
        query = query.filter(layer_id=layer_id)
    
    contributions = [ContributionIASchema.from_orm(contribution) for contribution in query]
    return contributions

@contributionia_router.get("/{contributionia_id}", response=ContributionIASchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_contribution_by_id(request, contributionia_id: int):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view this contribution.")

    contribution = get_object_or_404(ContributionIA, id=contributionia_id)
    return ContributionIASchema.from_orm(contribution)

@contributionia_router.get("/download/{contribution_id}", auth=[QueryTokenAuth(), HeaderTokenAuth()])
def download_contribution_file(request, contribution_id: int):
    contribution = get_object_or_404(ContributionIA, id=contribution_id)
    if contribution.file and hasattr(contribution.file, 'path'):
        file_path = contribution.file.path
        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=os.path.basename(file_path))
        else:
            raise Http404("File does not exist.")
    else:
        raise Http404("No file associated with this contribution.")

@contributionia_router.put("/{contributionia_id}", response=ContributionIASchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_contribution(request, contributionia_id: int, data: ContributionIAUpdateSchema, file: UploadedFile = File(None)):
    user_info = get_user_info_from_token(request)
    contribution = get_object_or_404(ContributionIA, id=contributionia_id)
    layer = get_object_or_404(Layer, id=contribution.layer_id)
    period = get_object_or_404(CampaignAI, id=layer.period_id)

    if not user_info.get('is_superuser') and str(period.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to update this contribution.")
     
    for attribute, value in data.dict(exclude_none=True).items():
        setattr(contribution, attribute, value)

    if file and contribution.file:
        if default_storage.exists(contribution.file.name):
            default_storage.delete(contribution.file.name)

    if file:
        contribution.file = file

    contribution.save()
    return contribution

@contributionia_router.delete("/{contributionia_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_contribution(request, contributionia_id: int):
    user_info = get_user_info_from_token(request)
    contribution = get_object_or_404(ContributionIA, id=contributionia_id)
    layer = get_object_or_404(Layer, id=contribution.layer_id)
    period = get_object_or_404(CampaignAI, id=layer.period_id)

    if not user_info.get('is_superuser') and str(period.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to delete this contribution.")
    
    if contribution.file:
        file_path = contribution.file.path
        if os.path.exists(file_path):
            os.remove(file_path)

    contribution.delete()
    return 204, None
