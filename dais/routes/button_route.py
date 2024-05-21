from ninja import Router, File
from ninja.files import UploadedFile
from django.shortcuts import get_object_or_404
from typing import Optional, List
from dais.schemas.button_schema import ButtonCreateSchema, ButtonSchema, ButtonUpdateSchema
from dais.models.button_models import Button
from dais.schemas.buttontype_schema import ButtonTypeOut
from dais.models.touchscreen_interactions_models import TouchScreenInteractions
from dais.models.clientmodule_models import ClientModule
from dais.models.client_models import Client
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token
from django.http import Http404, FileResponse
import os

button_router = Router(tags=['Buttons'])

@button_router.post('/', response={201: ButtonSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_button(request, button_in: ButtonCreateSchema, file: UploadedFile = File(None)):
    user_info = get_user_info_from_token(request)
    interaction = get_object_or_404(TouchScreenInteractions, id=button_in.interaction_id)
    client_module = get_object_or_404(ClientModule, id=interaction.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)
    
    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to add buttons')
    
    button_data = {**button_in.dict(exclude={'file_path'}), 'file': file}
    button = Button.objects.create(**button_data)
    
    buttontype_out = ButtonTypeOut.from_orm(button.button_type)

    button_schema = ButtonSchema.from_orm(button)
    button_schema.button_type = buttontype_out

    return 201, button_schema

@button_router.get('/', response=List[ButtonSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_buttons(request, interaction_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    interaction = get_object_or_404(TouchScreenInteractions, id=interaction_id)
    client_module = get_object_or_404(ClientModule, id=interaction.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)
    
    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to view buttons')

    query = Button.objects.all()
    if interaction_id is not None:
        query = query.filter(interaction_id=interaction_id)
    buttons = [ButtonSchema.from_orm(button) for button in query]
    return buttons

@button_router.get('/{button_id}', response=ButtonSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_button_by_id(request, button_id: int):
    user_info = get_user_info_from_token(request)
    button = get_object_or_404(Button, id=button_id)
    interaction = get_object_or_404(TouchScreenInteractions, id=button.interaction_id)
    client_module = get_object_or_404(ClientModule, id=interaction.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)
    
    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to view this button')
    
    return ButtonSchema.from_orm(button)

@button_router.get('/download/{button_id}', auth=[QueryTokenAuth(), HeaderTokenAuth()])
def download_formation_file(request, button_id: int):
    user_info = get_user_info_from_token(request)
    button = get_object_or_404(Button, id=button_id)
    interaction = get_object_or_404(TouchScreenInteractions, id=button.interaction_id)
    client_module = get_object_or_404(ClientModule, id=interaction.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to download this file.")
    
    if button.file and hasattr(button.file, 'path'):
        file_path = button.file.path
        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=os.path.basename(file_path))
        else:
            raise Http404("File does not exist.")
    else:
        raise Http404("No file associated with this button")    

@button_router.put('/{button_id}', response=ButtonSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_button(request, button_id: int, button_in: ButtonUpdateSchema):
    user_info = get_user_info_from_token(request)
    button = get_object_or_404(Button, id=button_id)
    interaction = get_object_or_404(TouchScreenInteractions, id=button.interaction_id)
    client_module = get_object_or_404(ClientModule, id=interaction.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)
    
    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to update this button')
    
    for attr, value in button_in.dict().items():
        setattr(button, attr, value)

    button.save()
    return ButtonSchema.from_orm(button)

@button_router.delete('/{button_id}', response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_button(request, button_id: int):
    user_info = get_user_info_from_token(request)
    button = get_object_or_404(Button, id=button_id)
    interaction = get_object_or_404(TouchScreenInteractions, id=button.interaction_id)
    client_module = get_object_or_404(ClientModule, id=interaction.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)
    
    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to delete this button')
    
    button.delete()
    return 204, None
