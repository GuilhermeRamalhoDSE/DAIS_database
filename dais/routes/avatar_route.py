from typing import Optional
from ninja import Router, File
from ninja.files import UploadedFile
from ninja.errors import HttpError
from django.shortcuts import get_object_or_404
from dais.models.avatar_models import Avatar
from dais.schemas.avatar_schema import AvatarSchema, AvatarUpdateSchema, AvatarCreateSchema  
from django.http import HttpRequest, FileResponse, Http404
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token, check_user_permission
import os
from django.core.files.storage import default_storage

avatar_router = Router(tags=['Avatar'])

@avatar_router.post("/", response={201: AvatarSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_avatar(request: HttpRequest, avatar_in: AvatarCreateSchema, file: UploadedFile = File(...)):
    if not check_user_permission(request):
        raise HttpError(403, "Only superusers can create avatars.")
    
    avatar = Avatar.objects.create(
        name=avatar_in.name, 
        file=file,
    )
    
    return 201, avatar

@avatar_router.get("/", response=list[AvatarSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_avatars(request, avatar_id: Optional[int] = None):
    if not check_user_permission(request):
        raise HttpError(403, "Only superusers can view all avatars.")
    
    if avatar_id:
        avatars = Avatar.objects.filter(id=avatar_id)
    else:
        avatars = Avatar.objects.all()
    
    return avatars

@avatar_router.get("/download/{avatar_id}")
def download_avatar_file(request, avatar_id: int):
    user_info = get_user_info_from_token(request)
    
    if not user_info.get('is_superuser', False):
        raise Http404("Only superusers are allowed to download avatar files.")

    avatar = get_object_or_404(Avatar, id=avatar_id)
    
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
        raise HttpError(403, "Only superusers can update avatars.")
    
    avatar = get_object_or_404(Avatar, id=avatar_id)

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
        raise HttpError(403, "Only superusers can delete avatars.")
    
    avatar = get_object_or_404(Avatar, id=avatar_id)

    if avatar.file:
        file_path = avatar.file.path
        if os.path.exists(file_path):
            os.remove(file_path)
    
    avatar.delete()
    return 204, None


   
