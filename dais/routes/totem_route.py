from ninja import Router
from typing import List, Optional
from django.shortcuts import get_object_or_404
from dais.models.totem_models import Totem  
from dais.models.client_models import Client
from dais.models.group_models import Group
from dais.schemas.totem_schema import TotemCreate, TotemUpdate, TotemOut  
from ninja.errors import HttpError
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token

totem_router = Router(tags=["Totem"])

@totem_router.post("/", response={201: TotemOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_totem(request, payload: TotemCreate):
    user_info = get_user_info_from_token(request)
    totem = Totem.objects.create(**payload.dict())
    return 201, generate_totem_response(totem)

@totem_router.get("/", response=List[TotemOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_totems(request):
    user_info = get_user_info_from_token(request)
    totems = Totem.objects.all()
    return [generate_totem_response(totem) for totem in totems]

@totem_router.get("/{totem_id}", response={200: TotemOut, 404: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_totem_by_id(request, totem_id: int):
    user_info = get_user_info_from_token(request)
    totem = get_object_or_404(Totem, id=totem_id)
    return 200, generate_totem_response(totem)

@totem_router.put("/{totem_id}", response=TotemOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_totem(request, totem_id: int, payload: TotemUpdate):
    user_info = get_user_info_from_token(request)
    totem = get_object_or_404(Totem, id=totem_id)
    for attr, value in payload.dict(exclude_unset=True).items():
        setattr(totem, attr, value)
    totem.save()
    return generate_totem_response(totem)

@totem_router.delete("/{totem_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_totem(request, totem_id: int):
    user_info = get_user_info_from_token(request)
    totem = get_object_or_404(Totem, id=totem_id)
    totem.delete()
    return 204, None

def generate_totem_response(totem):
    client = Client.objects.get(id=totem.client_id)
    group = Group.objects.get(id=totem.group_id)

    totem_data = {
        "id": totem.id,
        "license_id": totem.license_id,
        "client_id": totem.client_id,
        "client_name": client.name,
        "group_id": totem.group_id,
        "group_name": group.name,
        "installation_date": totem.installation_date,
        "active": totem.active,
        "screens": totem.screens,
        "comments": totem.comments,
    }
    return TotemOut(**totem_data)