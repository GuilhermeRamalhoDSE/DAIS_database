from ninja import Router
from typing import List, Optional
from django.shortcuts import get_object_or_404
from dais.models.client_models import Client 
from dais.models.group_models import Group
from dais.models.form_models import Form
from dais.schemas.form_schema import FormSchema
from dais.schemas.group_schema import GroupCreate, GroupUpdate, GroupOut, LastUpdateOut, FormIdSchema
from dais.schemas.module_schema import ModuleOut
from ninja.errors import HttpError
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token, check_user_permission


group_router = Router(tags=["Group"])

@group_router.post("/", response={201: GroupOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_group(request, payload: GroupCreate):
    client = get_object_or_404(Client, id=payload.client_id)
    
    group = Group.objects.create(**payload.dict(exclude={'forms_id'}))
    return 201, group

@group_router.post("/{group_id}/update-last-update/", response={200: LastUpdateOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_group_last_update(request, group_id: int):
    group = get_object_or_404(Group, id=group_id)
    group.update_last_update()
    return {"last_update": group.last_update}

@group_router.post("/{group_id}/add-form/", response={200: GroupOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def add_form_to_group(request, group_id: int, payload: FormIdSchema):
    group = get_object_or_404(Group, id=group_id)
    form = get_object_or_404(Form, id=payload.form_id)
    
    group.forms.add(form)
    
    return GroupOut.from_orm(group)

@group_router.post("/{group_id}/remove-form/", response={200: GroupOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def remove_form_from_group(request, group_id: int, payload: FormIdSchema):
    group = get_object_or_404(Group, id=group_id)
    form = get_object_or_404(Form, id=payload.form_id)
    
    if group.forms.filter(id=form.id).exists():
        group.forms.remove(form)
    
    return GroupOut.from_orm(group)

@group_router.get("/", response=List[GroupOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_groups(request, client_id: Optional[int] = None, license_id: Optional[int] = None):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view these groups.")

    user_info = get_user_info_from_token(request)
    user_license_id = user_info.get('license_id')

    if client_id:
        client = get_object_or_404(Client, id=client_id)
        if license_id:
            groups = Group.objects.filter(client=client, client__license_id=license_id)
        else:
            groups = Group.objects.filter(client=client, client__license_id=user_license_id)
    elif license_id:
        groups = Group.objects.filter(client__license_id=license_id)
    else:
        groups = Group.objects.filter(client__license_id=user_license_id)

    return groups

@group_router.get("/{group_id}", response=GroupOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_group_by_id(request, group_id: int):

    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view this group.")

    user_info = get_user_info_from_token(request)
    is_superuser = user_info.get('is_superuser', False)
    license_id = user_info.get('license_id')

    if is_superuser:
        group = get_object_or_404(Group, id=group_id)
    else:
        group = get_object_or_404(Group, id=group_id, client__license_id=license_id)

    return group

@group_router.get("/{group_id}/last-update", response=LastUpdateOut)
def get_group_last_update(request, group_id: int):   
    group = get_object_or_404(Group, id=group_id)

    return {"last_update": group.last_update}

@group_router.get("/{group_id}/modules/", response=List[ModuleOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_group_modules(request, group_id: int):
    group = get_object_or_404(Group, id=group_id)
    modules = group.modules.all()
    return [{'id': module.id, 'name': module.name, 'slug': module.slug} for module in modules]

@group_router.get("/{group_id}/forms/", response=List[FormSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_forms_by_group(request, group_id: int):
    group = get_object_or_404(Group, id=group_id)
    forms = group.forms.all()
    return [FormSchema.from_orm(form) for form in forms]

@group_router.put("/{group_id}", response=GroupOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_group(request, group_id: int, payload: GroupUpdate):

    group = get_object_or_404(Group, id=group_id)
    
    if payload.client_id is not None:
        group.client_id = payload.client_id
    if payload.name is not None:
        group.name = payload.name
    if payload.typology is not None:
        group.typology = payload.typology
    if payload.comments is not None:
        group.comments = payload.comments
    
    group.save()
    return group

@group_router.delete("/{group_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_group(request, group_id: int):
    group = get_object_or_404(Group, id=group_id)
    group.delete()
    return 204, None
