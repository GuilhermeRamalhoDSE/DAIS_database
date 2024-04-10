from typing import Optional
from ninja import Router, File
from ninja.files import UploadedFile
from ninja.errors import HttpError
from django.shortcuts import get_object_or_404
from dais.models.avatar_models import Avatar, License  
from dais.schemas.avatar_schema import AvatarSchema, AvatarUpdateSchema, AvatarCreateSchema  
from django.http import HttpRequest, FileResponse, Http404
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token, check_user_permission
import os
from django.core.files.storage import default_storage

avatar_router = Router(tags=['Avatar'])

@avatar_router.post("/", response={201: AvatarSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_avatar(request: HttpRequest, avatar_in: AvatarCreateSchema, file: UploadedFile = File(...)):
    user_info = get_user_info_from_token(request)
    is_superuser = check_user_permission(request)
    
    if is_superuser and avatar_in.license_id is not None:
        final_license_id = avatar_in.license_id
    else:
        final_license_id = user_info.get('license_id')
    
    if not final_license_id:
        raise HttpError(400, "license_id is required.")

    license = get_object_or_404(License, id=final_license_id)

    avatar = Avatar.objects.create(
        name=avatar_in.name, 
        license=license, 
        file=file,
        voice=avatar_in.voice  
    )
    
    return 201, avatar

@avatar_router.get("/", response=list[AvatarSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_avatars(request, avatar_id: Optional[int] = None):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view these avatars.")

    user_info = get_user_info_from_token(request)
    license_id = user_info.get('license_id')
    
    if avatar_id:
        avatars = Avatar.objects.filter(id=avatar_id)
        if license_id:
            avatars = avatars.filter(license_id=license_id)
    else:
        avatars = Avatar.objects.filter(license_id=license_id) if license_id else Avatar.objects.all()
    
    return avatars

@avatar_router.get("/download/{avatar_id}")
def download_avatar_file(request, avatar_id: int):
    user_info = get_user_info_from_token(request)
    
    avatar = get_object_or_404(Avatar, id=avatar_id)
    
    if not (user_info.get('is_superuser', False) or str(avatar.license_id) == str(user_info.get('license_id', ''))):
        raise Http404("You do not have permission to download this file.")

    if avatar.file and hasattr(avatar.file, 'path'):
        file_path = avatar.file.path
        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=os.path.basename(file_path))
        else:
            raise Http404("File does not exist.")
    else:
        raise Http404("No file associated with this avatar.")

@avatar_router.put("/{avatar_id}", response={200: AvatarSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_avatar(request, avatar_id: int, payload: AvatarUpdateSchema, file: UploadedFile = File(None)):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to update this avatar.")
    
    avatar = get_object_or_404(Avatar, id=avatar_id)
    user_info = get_user_info_from_token(request)

    if not user_info.get('is_superuser') and str(avatar.license_id) != str(user_info.get('license_id')):
        raise HttpError(403, "You do not have permission to update this avatar.")

    if file and avatar.file:
        if default_storage.exists(avatar.file.name):
            default_storage.delete(avatar.file.name)

    for attr, value in payload.dict(exclude_none=True).items():
        setattr(avatar, attr, value)

    if file: 
        avatar.file = file

    avatar.save()
    return avatar

@avatar_router.delete("/{avatar_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_avatar(request, avatar_id: int):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to delete this avatar.")
    
    avatar = get_object_or_404(Avatar, id=avatar_id)
    user_info = get_user_info_from_token(request)

    if not user_info.get('is_superuser') and str(avatar.license_id) != str(user_info.get('license_id')):
        raise HttpError(403, "You do not have permission to delete this avatar.")

    if avatar.file:
        file_path = avatar.file.path
        if os.path.exists(file_path):
            os.remove(file_path)
    
    avatar.delete()
    return 204, None

   
