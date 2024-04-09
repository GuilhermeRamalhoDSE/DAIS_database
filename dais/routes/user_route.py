from ninja import Router
from typing import List, Optional
from django.shortcuts import get_object_or_404
from dais.models.user_models import User
from dais.schemas.user_schema import UserSchema, UserCreateSchema, UserUpdateSchema
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import check_user_permission, get_user_info_from_token
from ninja.errors import HttpError
from django.db.models import F

user_router = Router(tags=['Users'])

@user_router.post("/", response={201: UserSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_user(request, user_in: UserCreateSchema):
    user_data = user_in.dict()
    password = user_data.pop('password')
    user = User.objects.create(**user_data)
    user.set_password(password)
    user.save()
    return user

from django.db.models import F

@user_router.get("/", response=List[UserSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_users(request, user_id: Optional[int] = None):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view these users.")
    
    user_info = get_user_info_from_token(request)
    license_id = user_info.get('license_id')
    
    if user_id:
        users = User.objects.filter(id=user_id)
        if license_id:
            users = users.filter(license_id=license_id)
    else:
        users = User.objects.filter(license_id=license_id) if license_id else User.objects.all()
    
    users = users.annotate(license_name=F('license__name'))
    
    return users

@user_router.put("/{user_id}", response=UserSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_user(request, user_id: int, data: UserUpdateSchema):
    user = get_object_or_404(User, id=user_id)
    for attribute, value in data.dict(exclude_none=True).items():
        setattr(user, attribute, value)
    user.save()
    return user

@user_router.delete("/{user_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_user(request, user_id: int):
    user = get_object_or_404(User, id=user_id)
    user.delete()
    return None
