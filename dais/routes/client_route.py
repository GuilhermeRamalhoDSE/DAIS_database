from typing import List, Optional
from ninja import Router
from ninja.errors import HttpError
from django.shortcuts import get_object_or_404
from dais.models.client_models import Client
from dais.schemas.client_schema import ClientIn, ClientOut
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token, check_user_permission

client_router = Router(tags=["Clients"])

@client_router.post("/", response={201: ClientOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_client(request, payload: ClientIn):
    user_info = get_user_info_from_token(request)
    license_id = user_info.get('license_id')
    
    client = Client.objects.create(**payload.dict(), license_id=license_id)
    return client

@client_router.get("/", response=List[ClientOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_clients(request, client_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    license_id = user_info.get('license_id')
    is_superuser = user_info.get('is_superuser', False)
    
    if is_superuser:
        if client_id:
            clients = Client.objects.filter(id=client_id)
        else:
            clients = Client.objects.all()
    else:
        if client_id:
            clients = Client.objects.filter(license_id=license_id, id=client_id)
        else:
            clients = Client.objects.filter(license_id=license_id)
    
    return list(clients)

@client_router.put("/{client_id}", response=ClientOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_client(request, client_id: int, payload: ClientIn):
    user_info = get_user_info_from_token(request)
    is_superuser = user_info.get('is_superuser', False) in [True, 'True', 'true', 1, '1']

    if not is_superuser:
        client = Client.objects.filter(id=client_id, license_id=user_info.get('license_id')).first()
        if not client:
            raise HttpError(404, "Client not found or you do not have permission to update this client.")
    else:
        client = get_object_or_404(Client, id=client_id)
    
    for attr, value in payload.dict().items():
        setattr(client, attr, value)
    client.save()
    return client


@client_router.delete("/{client_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_client(request, client_id: int):
    user_info = get_user_info_from_token(request)
    is_superuser = user_info.get('is_superuser', False) in [True, 'True', 'true', 1, '1']

    if not is_superuser:
        client = Client.objects.filter(id=client_id, license_id=user_info.get('license_id')).first()
        if not client:
            raise HttpError(404, "Client not found or you do not have permission to delete this client.")
    else:
        client = get_object_or_404(Client, id=client_id)

    client.delete()
    return {"success": True}

