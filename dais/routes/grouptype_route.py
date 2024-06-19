from ninja import Router
from dais.models.grouptype_models import GroupType
from dais.schemas.grouptype_schema import GroupTypeIn, GroupTypeOut
from ninja.errors import HttpError
from dais.utils import check_user_permission
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from django.shortcuts import get_object_or_404

group_type_router = Router(tags=['Group Types'])

@group_type_router.post('/', response={201: GroupTypeOut}, auth=[QueryTokenAuth(), HeaderTokenAuth])
def create_group_type(request, group_type_in: GroupTypeIn):
    if not check_user_permission:
        raise HttpError(403, "Only superusers can create group types.")
    
    group_type = GroupType.objects.create(**group_type_in.dict())
    return 201, group_type

@group_type_router.get('/{group_type_id}', response={200: GroupTypeOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_group_type(request, group_type_id: int):
    if not check_user_permission:
        raise HttpError(403, "Only superusers can view group type details.")
    
    group_type = get_object_or_404(GroupType, id=group_type_id)
    return group_type

@group_type_router.get('/', response=list[GroupTypeOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def list_group_types(request):
    if not check_user_permission:
        raise HttpError(403, "Only superusars can list group types.")
    
    group_type = GroupType.objects.all()
    return group_type

@group_type_router.put('/{group_type_id}', response={200: GroupTypeOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_group_type(request, group_type_id: int, group_type_in: GroupTypeIn):
    if not check_user_permission:
        raise HttpError(403, 'Only superusers can update group type.')
    
    group_type = get_object_or_404(GroupType, id=group_type_id)
    for attr, value in group_type_in.dict().items():
        setattr(group_type, attr, value)

    group_type.save()
    return group_type

@group_type_router.delete('/{group_type_id}', response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_group_type(request, group_type_id: int):
    if not check_user_permission:
        raise HttpError(403, "Only superusers can delete group type.")
    
    group_type = get_object_or_404(GroupType, id=group_type_id)
    group_type.delete()
    return 204, None