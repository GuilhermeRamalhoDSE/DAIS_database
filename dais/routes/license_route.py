from ninja import Router, Query
from typing import List
from django.shortcuts import get_object_or_404
from dais.models.license_models import License
from dais.models.avatar_models import Avatar
from dais.schemas.license_schema import LicenseSchema, LicenseCreateSchema, LicenseUpdateSchema, AvatarSchema, AvatarIdSchema
from dais.auth import QueryTokenAuth, HeaderTokenAuth


license_router = Router(tags=['Licenses'])

@license_router.post("/", response={201: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_license(request, payload: LicenseCreateSchema):
    license_data = payload.dict(exclude={'avatars_id'})
    license_obj = License.objects.create(**license_data)
    
    return LicenseSchema.from_orm(license_obj)

@license_router.post("/{license_id}/add-avatar/", response={200: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def add_avatar_to_license(request, license_id: int, payload: AvatarIdSchema):
    license = get_object_or_404(License, id=license_id)
    avatar = get_object_or_404(Avatar, id=payload.avatar_id)
    
    license.avatars.add(avatar)
    
    return LicenseSchema.from_orm(license)

@license_router.post("/{license_id}/remove-avatar/", response={200: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def remove_avatar_from_license(request, license_id: int, payload: AvatarIdSchema):
    license = get_object_or_404(License, id=license_id)
    avatar = get_object_or_404(Avatar, id=payload.avatar_id)
    
    if license.avatars.filter(id=avatar.id).exists():
        license.avatars.remove(avatar)
    
    return LicenseSchema.from_orm(license)

@license_router.get("/", response=List[LicenseSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_licenses(request, license_id: int = Query(None), name: str = Query(None)):
    filters = {}
    if license_id is not None:
        filters['id'] = license_id
    if name:
        filters['name__icontains'] = name

    licenses = License.objects.filter(**filters)
    return [LicenseSchema.from_orm(license) for license in licenses]

@license_router.put("/{license_id}", response=LicenseSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_license(request, license_id: int, payload: LicenseUpdateSchema):
    license_obj = get_object_or_404(License, id=license_id)
    for attr, value in payload.dict(exclude_unset=True).items():
        setattr(license_obj, attr, value)
    license_obj.save()
    return LicenseSchema.from_orm(license_obj)

@license_router.delete("/{license_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_license(request, license_id: int):
    license_obj = get_object_or_404(License, id=license_id)
    license_obj.delete()
    return {"success": True}
