from ninja import Router
from typing import List
from django.shortcuts import get_object_or_404
from dais.models.totem_models import Totem
from dais.models.logs_models import Log
from dais.schemas.logs_schema import LogCreate, LogOut
from ninja.errors import HttpError
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token, check_user_permission
from datetime import datetime

log_router = Router(tags=["Log"])

@log_router.post("/", response={201: LogOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_log(request, payload: LogCreate):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to create logs.")

    totem = get_object_or_404(Totem, id=payload.totem_id)
    user_info = get_user_info_from_token(request)
    if not (totem.group.client.license_id == user_info.get('license_id') or user_info.get('is_superuser')):
        raise HttpError(403, "You do not have permission to access this totem.")

    log = Log.objects.create(**payload.dict(), typology=totem.group.typology, date=datetime.now())
    return 201, log

@log_router.get("/totem/{totem_id}", response=List[LogOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_logs_by_totem(request, totem_id: int):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view these logs.")

    totem = get_object_or_404(Totem, id=totem_id)
    user_info = get_user_info_from_token(request)
    if not (totem.group.client.license_id == user_info.get('license_id') or user_info.get('is_superuser')):
        raise HttpError(403, "You do not have permission to access these logs.")

    logs = Log.objects.filter(totem=totem)
    return logs

@log_router.get("/{log_id}", response=LogOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_log_by_id(request, log_id: int):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view this log.")

    log = get_object_or_404(Log, id=log_id)
    user_info = get_user_info_from_token(request)
    if not (log.totem.group.client.license_id == user_info.get('license_id') or user_info.get('is_superuser')):
        raise HttpError(403, "You do not have permission to access this log.")

    return log

@log_router.delete("/{log_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_log(request, log_id: int):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to delete this log.")

    log = get_object_or_404(Log, id=log_id)
    user_info = get_user_info_from_token(request)
    if not (log.totem.group.client.license_id == user_info.get('license_id') or user_info.get('is_superuser')):
        raise HttpError(403, "You do not have permission to access this log.")

    log.delete()
    return 204, None
