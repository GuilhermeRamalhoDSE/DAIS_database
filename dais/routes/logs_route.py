from ninja import Router
from typing import List
from django.shortcuts import get_object_or_404
from dais.models.totem_models import Totem
from dais.models.logs_models import Log
from dais.schemas.logs_schema import LogCreate, LogOut, LogCreateOut
from ninja.errors import HttpError
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token, check_user_permission
from datetime import datetime

log_router = Router(tags=["Log"])

@log_router.get("/create-log/", response={201: LogCreateOut})
def create_log_from_url(request, license_id: int, totem_id: int, client: str, typology: str, campaign: str, logtype: str, information: str):
    totem = get_object_or_404(Totem, id=totem_id)
    log = Log.objects.create(
        license_id=license_id,
        totem=totem,
        client=client,
        typology=typology,
        campaign=campaign,
        logtype=logtype,
        information=information,
        date=datetime.now(),
    )

    log_output = LogCreateOut(
        id=log.id,
        license_id=log.license_id,
        totem_id=log.totem_id,
        date=log.date,
        typology=log.typology,
        information=log.information,
        client=log.client,  
        campaign=log.campaign,
        logtype=log.logtype
    )
    return 201, log_output


@log_router.get("/", response=List[LogOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_logs_by_license(request, license_id: int):
    user_info = get_user_info_from_token(request)
    if not user_info.get('is_superuser') and str(license_id) != str(user_info.get('license_id')):
        raise HttpError(403, "You do not have permission to view these logs.")

    query = Log.objects.all()
    if license_id is not None:
        query = query.filter(license_id=license_id)
    
    logs = [LogOut.from_orm(log) for log in query]

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
