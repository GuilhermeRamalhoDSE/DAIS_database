from ninja import Router
from django.shortcuts import get_object_or_404
from typing import Optional, List
from dais.schemas.clientmodule_schema import ClientModuleCreateSchema, ClientModuleSchema, ClientModuleUpdateSchema, GroupIdSchema
from dais.schemas.module_schema import ModuleOut
from dais.models.clientmodule_models import ClientModule
from dais.models.client_models import Client
from dais.models.group_models import Group
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token
from django.http import Http404

client_module_router = Router(tags=['Client Module'])

@client_module_router.post('/', response={201: ClientModuleSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_client_module(request, client_module_in: ClientModuleCreateSchema):
    user_info = get_user_info_from_token(request)
    client = get_object_or_404(Client, id=client_module_in.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to add client modules')
    
    client_module_data = {**client_module_in.dict(exclude={'groups_id'})}

    client_module = ClientModule.objects.create(**client_module_data)

    module_out = ModuleOut.from_orm(client_module.module)

    client_module_schema = ClientModuleSchema.from_orm(client_module)
    client_module_schema.module = module_out

    return 201, client_module_schema

@client_module_router.post("/{client_module_id}/add-group/", response={200: ClientModuleSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def add_group_to_module(request, client_module_id: int, payload: GroupIdSchema):
    client_module = get_object_or_404(ClientModule, id=client_module_id)
    group = get_object_or_404(Group, id=payload.group_id)
    
    client_module.groups.add(group)
    
    return ClientModuleSchema.from_orm(client_module)

@client_module_router.post("/{client_module_id}/remove-group/", response={200: ClientModuleSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def remove_group_from_module(request, client_module_id: int, payload: GroupIdSchema):
    client_module = get_object_or_404(ClientModule, id=client_module_id)
    group = get_object_or_404(Group, id=payload.group_id)
    
    if client_module.groups.filter(id=group.id).exists():
        client_module.groups.remove(group)
    
    return ClientModuleSchema.from_orm(client_module)

@client_module_router.get('/', response=List[ClientModuleSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_client_module(request, client_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    client = get_object_or_404(Client, id=client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to view client modules')
    
    query = ClientModule.objects.all()
    if client_id is not None:
        query = query.filter(client_id=client_id)
    
    client_modules = [ClientModuleSchema.from_orm(cm) for cm in query]
    return client_modules

@client_module_router.get('/{client_module_id}', response=ClientModuleSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_client_module_by_id(request, client_module_id: int):
    user_info = get_user_info_from_token(request)
    client_module = get_object_or_404(ClientModule, id=client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to view this client module')    
    
    return ClientModuleSchema.from_orm(client_module)

@client_module_router.put('/{client_module_id}', response=ClientModuleSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_client_module(request, client_module_id: int, client_module_in: ClientModuleUpdateSchema):
    user_info = get_user_info_from_token(request)
    client_module = get_object_or_404(ClientModule, id=client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to update this client module')    

    for attr, value in  client_module_in.dict().items():
        setattr(client_module, attr, value)

    client_module.save()
    return client_module

@client_module_router.delete('/{client_module_id}', response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_client_module(request, client_module_id: int):
    user_info = get_user_info_from_token(request)
    client_module = get_object_or_404(ClientModule, id=client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to delete this client module')     

    client_module.delete()
    return 204, None 