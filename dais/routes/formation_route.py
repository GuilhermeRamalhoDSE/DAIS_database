from ninja import Router, UploadedFile, File
from django.shortcuts import get_object_or_404
from typing import List, Optional
from dais.schemas.formation_schema import FormationCreateSchema, FormationUpdateSchema, FormationSchema, LanguageOut, LayerOut, VoiceOut
from dais.models.formation_models import Formation
from dais.models.layer_models import Layer
from dais.models.campaignai_models import CampaignAI
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token
from django.http import Http404, FileResponse
import os
from django.core.files.storage import default_storage

formation_router = Router(tags=['Formations'])

@formation_router.post('/', response={201: FormationSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_formation(request, formation_in: FormationCreateSchema, file: UploadedFile = File(...)):
    user_info = get_user_info_from_token(request)
    layer = get_object_or_404(Layer, id=formation_in.layer_id)
    campaignai = get_object_or_404(CampaignAI, id=layer.campaignai_id)

    if not user_info.get('is_superuser') and str(campaignai.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to add formation to this layer.")

    formation_data = {**formation_in.dict(exclude=['file_path']), 'file':file}

    formation = Formation.objects.create(**formation_data)

    layer_out = LayerOut.from_orm(formation.layer)
    language_out = LanguageOut.from_orm(formation.language)
    voice_out = VoiceOut.from_orm(formation.voice)

    formation_schema = FormationSchema.from_orm(formation)
    formation_schema.language = language_out
    formation_schema.voice = voice_out

    return 201, formation_schema

@formation_router.get('/', response=List[FormationSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_formations(request, layer_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    layer = get_object_or_404(Layer, id=layer_id)
    campaignai = get_object_or_404(CampaignAI, id=layer.campaignai_id)

    if not user_info.get('is_superuser') and str(campaignai.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to view formations.")
    
    query = Formation.objects.all()
    if layer_id is not None:
        query = query.filter(layer_id=layer_id)

    formations = [FormationSchema.from_orm(formation) for formation in query]
    return formations

@formation_router.get('/{formation_id}', response=FormationSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_formation_by_id(request, formation_id: int):
    user_info = get_user_info_from_token(request)
    formation = get_object_or_404(Formation, id=formation_id)
    layer = get_object_or_404(Layer, id=formation.layer_id)
    campaignai = get_object_or_404(CampaignAI, id=layer.campaignai_id)

    if not user_info.get('is_superuser') and str(campaignai.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to view this formation.")
    
    return FormationSchema.from_orm(formation)

@formation_router.get('/download/{formation_id}', auth=[QueryTokenAuth(), HeaderTokenAuth()])
def download_formation_file(request, formation_id: int):
    user_info = get_user_info_from_token(request)
    formation = get_object_or_404(Formation, id=formation_id)
    layer = get_object_or_404(Layer, id=formation.layer_id)
    campaignai = get_object_or_404(CampaignAI, id=layer.campaignai_id)

    if not user_info.get('is_superuser') and str(campaignai.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to download this formation.")
    
    if formation.file and hasattr(formation.file, 'path'):
        file_path = formation.file.path
        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=os.path.basename(file_path))
        else:
            raise Http404("File does not exist.")
    else:
        raise Http404("No file associated with this formation")    
    
@formation_router.put('/{formation_id}', response=FormationSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_formation(request, formation_id: int, formation_in: FormationUpdateSchema, file: UploadedFile = File(None)):
    user_info = get_user_info_from_token(request)
    formation = get_object_or_404(Formation, id=formation_id)
    layer = get_object_or_404(Layer, id=formation.layer_id)
    campaignai = get_object_or_404(CampaignAI, id=layer.campaignai_id)

    if not user_info.get('is_superuser') and str(campaignai.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to update this formation.")
    
    for attr, value in formation_in.dict(exclude_none=True).items():
        setattr(formation, attr, value)

    if file and formation.file:
        if default_storage.exists(formation.file.name):
            default_storage.delete(formation.file.name)
    
    if file:
        formation.file = file

    formation.save()
    return formation

@formation_router.delete('/{formation_id}', response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_formation(request, formation_id: int):
    user_info = get_user_info_from_token(request)
    formation = get_object_or_404(Formation, id=formation_id)
    layer = get_object_or_404(Layer, id=formation.layer_id)
    campaignai = get_object_or_404(CampaignAI, id=layer.campaignai_id)

    if not user_info.get('is_superuser') and str(campaignai.group.client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to delete this formation.")
    
    if formation.file:
        file_path = formation.file.path
        if os.path.exists(file_path):
            os.remove(file_path)

    formation.delete()
    return 204, None