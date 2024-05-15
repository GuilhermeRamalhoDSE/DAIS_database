from ninja import Router
from django.shortcuts import get_object_or_404
from typing import Optional, List
from dais.schemas.touchscreen_interactions_schema import TouchScreenInteractionsCreateSchema, TouchScreenInteractionsSchema, TouchScreenInteractionsUpdateSchema
from dais.models.touchscreen_interactions_models import TouchScreenInteractions
from dais.models.clientmodule_models import ClientModule
from dais.models.client_models import Client
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token
from django.http import Http404

touchscreen_interactions_router = Router(tags=['Touchscreen Interaction'])

@touchscreen_interactions_router.post('/', response={201: TouchScreenInteractionsSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_touchscreen_interactions(request, touchscreen_interactions_in: TouchScreenInteractionsCreateSchema):
    user_info = get_user_info_from_token(request)
    client_module = get_object_or_404(ClientModule, id=touchscreen_interactions_in.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to add touchscreen interactions')
    
    touchscreen_interactions_data = {**touchscreen_interactions_in.dict()}

    touchscreen_interactions = TouchScreenInteractions.objects.create(**touchscreen_interactions_data)

    touchscreen_interactions_schema = TouchScreenInteractionsSchema.from_orm(touchscreen_interactions)

    return 201, touchscreen_interactions_schema

@touchscreen_interactions_router.get('/', response=List[TouchScreenInteractionsSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_touchscreen_interactions(request, client_module_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    client_module = get_object_or_404(ClientModule, id=client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to view touchscreen interactions')
    
    query = TouchScreenInteractions.objects.all()
    if client_module_id is not None:
        query = query.filter(client_module_id=client_module_id)

    touchscreen_interactions = [TouchScreenInteractionsSchema.from_orm(tsi) for tsi in query]
    return touchscreen_interactions

@touchscreen_interactions_router.get('/{touchscreen_interactions_id}', response=TouchScreenInteractionsSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_touchscreen_interactions_by_id(request, touchscreen_interactions_id: int):
    user_info = get_user_info_from_token(request)
    touchscreen_interactions = get_object_or_404(TouchScreenInteractions, id=touchscreen_interactions_id)
    client_module = get_object_or_404(ClientModule, id=touchscreen_interactions.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to view this touchscreen interaction')
    
    return TouchScreenInteractionsSchema.from_orm(touchscreen_interactions)
    
@touchscreen_interactions_router.put('/{touchscreen_interactions_id}',response=TouchScreenInteractionsSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_touchscreen_interactions(request, touchscreen_interactions_id: int,touchscreen_interactions_in: TouchScreenInteractionsUpdateSchema):
    user_info = get_user_info_from_token(request)
    touchscreen_interactions = get_object_or_404(TouchScreenInteractions, id=touchscreen_interactions_id)
    client_module = get_object_or_404(ClientModule, id=touchscreen_interactions.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to update this touchscreen interaction')
    
    for attr, value in touchscreen_interactions_in.dict().items():
        setattr(touchscreen_interactions, attr, value)

    touchscreen_interactions.save()
    return touchscreen_interactions

@touchscreen_interactions_router.delete('/{touchscreen_interactions_id}', response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_touchscreen_interactions(request, touchscreen_interactions_id: int):
    user_info = get_user_info_from_token(request)
    touchscreen_interactions = get_object_or_404(TouchScreenInteractions, id=touchscreen_interactions_id)
    client_module = get_object_or_404(ClientModule, id=touchscreen_interactions.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to delete this touchscreen interaction')
    
    touchscreen_interactions.delete()
    return 204, None