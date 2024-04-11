from ninja import Router
from typing import List, Optional
from django.shortcuts import get_object_or_404
from dais.models.license_models import License
from dais.models.group_models import Group
from dais.schemas.group_schema import GroupCreate, GroupUpdate, GroupOut
from ninja.errors import HttpError
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token

group_router = Router(tags=["Group"])

@group_router.post("/", response={201: GroupOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_group(request, payload: GroupCreate):
    user_info = get_user_info_from_token(request)
    license_id = user_info.get('license_id')
    is_superuser = user_info.get('is_superuser', False)

    if is_superuser:
        license = get_object_or_404(License, id=payload.license_id)
    else:
        if license_id is None or (payload.license_id and payload.license_id != license_id):
            raise HttpError(400, "Invalid license ID.")
        license = get_object_or_404(License, id=license_id)

    group = Group.objects.create(**payload.dict(exclude={'license_id'}), license=license)
    return 201, group


@group_router.get("/", response=List[GroupOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_groups(request, group_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    license_id = user_info.get('license_id')
    is_superuser = user_info.get('is_superuser', False)

    if is_superuser:
        if group_id:
            groups = Group.objects.filter(id=group_id)
        else:
            groups = Group.objects.all()
    else:
        if group_id:
            groups = Group.objects.filter(license_id=license_id, id=group_id)
        else:
            groups = Group.objects.filter(license_id=license_id)
    
    return list(groups)

@group_router.get("/{group_id}", response={200: GroupOut, 404: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_group_by_id(request, group_id: int):
    user_info = get_user_info_from_token(request)
    license_id = user_info.get('license_id')
    is_superuser = user_info.get('is_superuser', False)

    if is_superuser:
        group = get_object_or_404(Group, id=group_id)
    else:
        group = get_object_or_404(Group, id=group_id, license_id=license_id)
    
    return 200, group

@group_router.put("/{group_id}", response=GroupOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_group(request, group_id: int, payload: GroupUpdate):
    user_info = get_user_info_from_token(request)
    is_superuser = user_info.get('is_superuser', False)

    if not is_superuser:
        group = Group.objects.filter(id=group_id, license_id=user_info.get('license_id')).first()
        if not group:
            raise HttpError(404, "Group not found or you do not have permission to update this group.")
    else:
        group = get_object_or_404(Group, id=group_id)

    for attr, value in payload.dict(exclude_unset=True).items():
        setattr(group, attr, value)
    group.save()

    return group

@group_router.delete("/{group_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_group(request, group_id: int):
    user_info = get_user_info_from_token(request)
    is_superuser = user_info.get('is_superuser', False)

    if not is_superuser:
        group = Group.objects.filter(id=group_id, license_id=user_info.get('license_id')).first()
        if not group:
            raise HttpError(404, "Group not found or you do not have permission to delete this group.")
    else:
        group = get_object_or_404(Group, id=group_id)

    group.delete()
    return 204, None
