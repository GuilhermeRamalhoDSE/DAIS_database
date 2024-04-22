from typing import Optional, List
from ninja import Router, File, Query
from ninja.files import UploadedFile
from ninja.errors import HttpError
from django.shortcuts import get_object_or_404
from django.http import HttpRequest, FileResponse, Http404
from dais.models.screen_models import Screen
from dais.models.totem_models import Totem
from dais.schemas.screen_schema import ScreenOutSchema, ScreenCreateSchema, ScreenUpdateSchema
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token, check_user_permission
import os
from django.core.files.storage import default_storage

screen_router = Router(tags=['Screen'])

@screen_router.post("/", response={201: ScreenOutSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_screen(request: HttpRequest, screen_in: ScreenCreateSchema, logo: UploadedFile = File(...), background: UploadedFile = File(...)):
    user_info = get_user_info_from_token(request)
    is_superuser = user_info.get('is_superuser', False)
    is_staff = user_info.get('is_staff', False)

    if not (is_superuser or is_staff):
        raise HttpError(403, "Only superusers or admins can create screens.")

    screen = Screen.objects.create(
        totem_id=screen_in.totem_id,
        typology=screen_in.typology,
        logo=logo,
        background=background,
        footer=screen_in.footer
    )

    return 201, ScreenOutSchema.from_orm(screen)

@screen_router.get("/", response=List[ScreenOutSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_screens(request, totem_id: Optional[int] = None):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view these screens.")

    user_info = get_user_info_from_token(request)
    license_id = user_info.get('license_id')

    if not totem_id:
        raise HttpError(400, "Totem ID is required.")

    totem = get_object_or_404(Totem, id=totem_id, group__client__license_id=license_id)

    screens = Screen.objects.filter(totem=totem).order_by('id')

    return [ScreenOutSchema.from_orm(screen) for screen in screens]

@screen_router.get("/{screen_id}", response=ScreenOutSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_screen_by_id(request, screen_id: int):
    user_info = get_user_info_from_token(request)
    user_license_id = str(user_info.get('license_id'))
    is_superuser = user_info.get('is_superuser', False)

    screen = get_object_or_404(Screen, id=screen_id)
    totem_license_id = str(screen.totem.group.client.license_id)

    if is_superuser or totem_license_id == user_license_id:
        return ScreenOutSchema.from_orm(screen)
    else:
        raise HttpError(403, "You do not have permission to view this screen.")

@screen_router.get("/download/logo/{screen_id}", auth=[QueryTokenAuth(), HeaderTokenAuth()])
def download_screen_logofile(request, screen_id: int):
    user_info = get_user_info_from_token(request)
    is_superuser = user_info.get('is_superuser', False)
    user_license_id = str(user_info.get('license_id'))

    screen = get_object_or_404(Screen, id=screen_id)
    
    screen_license_id = str(screen.totem.group.client.license_id)

    if is_superuser or screen_license_id == user_license_id:
        if screen.logo and hasattr(screen.logo, 'path'):
            logo_path = screen.logo.path
            if os.path.exists(logo_path):
                return FileResponse(open(logo_path, 'rb'), as_attachment=True, filename=os.path.basename(logo_path))
            else:
                raise Http404("Logo does not exist.")
        else:
            raise Http404("No logo associated with this screen.")
    else:
        raise Http404("You do not have permission to download this logo.")
    
@screen_router.get("/download/background/{screen_id}", auth=[QueryTokenAuth(), HeaderTokenAuth()])
def download_screen_backgroundfile(request, screen_id: int):
    user_info = get_user_info_from_token(request)
    is_superuser = user_info.get('is_superuser', False)
    user_license_id = str(user_info.get('license_id'))

    screen = get_object_or_404(Screen, id=screen_id)
    
    screen_license_id = str(screen.totem.group.client.license_id)

    if is_superuser or screen_license_id == user_license_id:
        if screen.background and hasattr(screen.background, 'path'):
            background_path = screen.background.path
            if os.path.exists(background_path):
                return FileResponse(open(background_path, 'rb'), as_attachment=True, filename=os.path.basename(background_path))
            else:
                raise Http404("Logo does not exist.")
        else:
            raise Http404("No background associated with this screen.")
    else:
        raise Http404("You do not have permission to download this background.")

@screen_router.put("/{screen_id}", response=ScreenOutSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_screen(request, screen_id: int, screen_in: ScreenUpdateSchema, logo: UploadedFile = File(None), background: UploadedFile = File(None)):
    user_info = get_user_info_from_token(request)
    screen = get_object_or_404(Screen, id=screen_id)

    if not user_info.get('is_superuser') and str(screen.totem.group.client.license_id) != str(user_info.get('license_id')):
        raise Http404("You do not have permission to update this screen.")
    
    for attr, value in screen_in.dict(exclude_none=True).items():
        setattr(screen, attr, value)

    if logo:
        screen.logo = logo

    if background:
        screen.background = background

    screen.save()
    return ScreenOutSchema.from_orm(screen)

@screen_router.delete("/{screen_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_screen(request, screen_id: int):
    user_info = get_user_info_from_token(request)
    screen = get_object_or_404(Screen, id=screen_id)

    if not user_info.get('is_superuser') and str(screen.totem.group.client.license_id) != str(user_info.get('license_id')):
        raise Http404("You do not have permission to delete this screen.")
    
    if screen.logo:
        os.remove(screen.logo.path)
    if screen.background:
        os.remove(screen.background.path)

    screen.delete()
    return 204, None
