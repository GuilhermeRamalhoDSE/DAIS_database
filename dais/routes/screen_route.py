from typing import Optional, List
from ninja import Router, File, Query
from ninja.files import UploadedFile
from ninja.errors import HttpError
from django.shortcuts import get_object_or_404
from django.http import HttpRequest, FileResponse, Http404
from dais.models.screen_models import Screen
from dais.models.totem_models import Totem
from dais.models.group_models import Group
from dais.models.client_models import Client
from dais.schemas.screen_schema import ScreenOutSchema, ScreenCreateSchema, ScreenUpdateSchema
from dais.schemas.screentype_schema import ScreenTypeOut
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token, check_user_permission
import os

screen_router = Router(tags=['Screen'])

@screen_router.post("/", response={201: ScreenOutSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_screen(request: HttpRequest, screen_in: ScreenCreateSchema):
    user_info = get_user_info_from_token(request)
    totem = get_object_or_404(Totem, id=screen_in.totem_id)
    group = get_object_or_404(Group, id=totem.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to add screens to this totem.")

    screen_data = {**screen_in.dict()}
    
    screen = Screen.objects.create(**screen_data)
    screentype_out = ScreenTypeOut.from_orm(screen.typology)

    screen_schema = ScreenOutSchema.from_orm(screen)
    screen_schema.typology = screentype_out

    return 201, screen_schema

@screen_router.get("/", response=List[ScreenOutSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_screens(request, totem_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    totem = get_object_or_404(Totem, id=totem_id)
    group = get_object_or_404(Group, id=totem.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to view screens on this totem.")

    if not totem_id:
        raise HttpError(400, "Totem ID is required.")

    query = Screen.objects.all()
    if totem_id is not None:
        query = query.filter(totem_id=totem_id)

    screens = [ScreenOutSchema.from_orm(screen) for screen in Query]
    return screens

@screen_router.get("/{screen_id}", response=ScreenOutSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_screen_by_id(request, screen_id: int):
    user_info = get_user_info_from_token(request)
    screen = get_object_or_404(Screen, id=screen_id)
    totem = get_object_or_404(Totem, id=screen.totem_id)
    group = get_object_or_404(Group, id=totem.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to view this screen.")

    return ScreenOutSchema.from_orm(screen)


@screen_router.put("/{screen_id}", response=ScreenOutSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_screen(request, screen_id: int, screen_in: ScreenUpdateSchema, logo: UploadedFile = File(None), background: UploadedFile = File(None)):
    user_info = get_user_info_from_token(request)
    screen = get_object_or_404(Screen, id=screen_id)
    totem = get_object_or_404(Totem, id=screen.totem_id)
    group = get_object_or_404(Group, id=totem.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to update this screen.")
    
    for attr, value in screen_in.dict(exclude_none=True).items():
        setattr(screen, attr, value)

    screen.save()
    return ScreenOutSchema.from_orm(screen)

@screen_router.delete("/{screen_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_screen(request, screen_id: int):
    user_info = get_user_info_from_token(request)
    screen = get_object_or_404(Screen, id=screen_id)
    totem = get_object_or_404(Totem, id=screen.totem_id)
    group = get_object_or_404(Group, id=totem.group_id)
    client = get_object_or_404(Client, id=group.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
       raise Http404("You do not have permission to delete this screen.")

    screen.delete()
    return 204, None
