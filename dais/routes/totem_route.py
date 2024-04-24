from ninja import Router
from typing import List, Optional
from django.shortcuts import get_object_or_404
from dais.models.totem_models import Totem  
from dais.models.client_models import Client
from dais.models.group_models import Group
from dais.schemas.totem_schema import TotemCreate, TotemUpdate, TotemOut  
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token, check_user_permission
from django.http import Http404
from ninja.errors import HttpError
from dais.services import duplicate_totem_and_screens

totem_router = Router(tags=["Totem"])

@totem_router.post("/", response={201: TotemOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_totem(request, payload: TotemCreate):
    user_info = get_user_info_from_token(request)
    is_superuser = check_user_permission(request)

    if is_superuser:
        group_id = payload.group_id
    else:
        group_id = user_info.get('group_id')

    if not group_id:
        raise Http404("Group ID is required.")
    
    group = get_object_or_404(Group, id=group_id)

    if not is_superuser and str(group.client.license_id) != str(user_info.get('license_id')):
        raise Http404("You do not have permission to add totem to this group.")
    
    totem = Totem.objects.create(**payload.dict())

    return 201, totem

@totem_router.post("/duplicate/{totem_id}", response={201: TotemOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def duplicate_totem(request, totem_id: int):
    user_info = get_user_info_from_token(request)
    totem = get_object_or_404(Totem, id=totem_id)
    group = get_object_or_404(Group, id=totem.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get("is_superuser") and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to duplicate this totem.')
    
    new_totem = duplicate_totem_and_screens(totem_id)

    return 201, TotemOut.from_orm(new_totem)

@totem_router.post("/{totem_id}/activate", response={200: TotemOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def active_totem(request, totem_id: int):
    user_info = get_user_info_from_token(request)
    totem = get_object_or_404(Totem, id=totem_id)
    group = get_object_or_404(Group, id=totem.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get("is_superuser") and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to active this totem.')
    
    totem.active=True
    totem.save()
    return 200, totem

@totem_router.post("/{totem_id}/deactivate", response={200: TotemOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def deactive_totem(request, totem_id: int):
    user_info = get_user_info_from_token(request)
    totem = get_object_or_404(Totem, id=totem_id)
    group = get_object_or_404(Group, id=totem.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get("is_superuser") and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to deactive this totem.')
    
    totem.active=False
    totem.save()
    return 200, totem 

@totem_router.get("/", response=List[TotemOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_totems(request, group_id: Optional[int] = None):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view these totems.")
    
    user_info = get_user_info_from_token(request)
    license_id = user_info.get('license_id')

    if not group_id:
        raise HttpError(400, "Group ID is required.")
    
    if license_id is not None:
        group = get_object_or_404(Group.objects.select_related('client'), id=group_id, client__license_id=license_id)
    else:
        group = get_object_or_404(Group, id=group_id)
    
    totems_query = Totem.objects.filter(group=group).order_by('id')
    
    totems = [TotemOut.from_orm(totem) for totem in totems_query]
    
    return totems


@totem_router.get("/{totem_id}", response={200: TotemOut, 404: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_totem_by_id(request, totem_id: int):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view this totem.")
    
    user_info = get_user_info_from_token(request)
    license_id = user_info.get('license_id')
    
    totem = get_object_or_404(Totem, id=totem_id)

    return totem

@totem_router.put("/{totem_id}", response=TotemOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_totem(request, totem_id: int, payload: TotemUpdate):
    user_info = get_user_info_from_token(request)
    totem = get_object_or_404(Totem, id=totem_id)
    group = get_object_or_404(Group, id=totem.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404("You do not have permission to update this totem.")

    for attribute, value in payload.dict(exclude_none=True).items():
        setattr(totem, attribute, value)

    totem.save()
    return totem

@totem_router.delete("/{totem_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_totem(request, totem_id: int):
    user_info = get_user_info_from_token(request)
    totem = get_object_or_404(Totem, id=totem_id)
    group = get_object_or_404(Group, id=totem.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser', False) and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404("You do not have permission to delete this totem.")
    
    totem.delete()
    return 204, None