from ninja import Router
from typing import List, Optional
from django.shortcuts import get_object_or_404
from dais.models.periodds_models import PeriodDS
from dais.models.group_models import Group
from dais.schemas.periodds_schema import PeriodDSCreate, PeriodDSUpdate, PeriodDSOut
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token, check_user_permission
from ninja.errors import HttpError

periodds_router = Router(tags=["PeriodDS"])

@periodds_router.post("/", response={201: PeriodDSOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_periodds(request, payload: PeriodDSCreate):
    user_info = get_user_info_from_token(request)
    is_superuser = check_user_permission(request)

    if not is_superuser:
        raise HttpError(403, "You do not have permission to create a periodds.")
    
    group = get_object_or_404(Group, id=payload.group_id)

    periodds = PeriodDS.objects.create(**payload.dict())

    return 201, periodds

@periodds_router.get("/", response=List[PeriodDSOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_perioddss(request, group_id: Optional[int] = None):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view these perioddss.")

    if group_id:
        periods_query = PeriodDS.objects.filter(group_id=group_id, active=True)
    else:
        periods_query = PeriodDS.objects.all(active=True)
    
    periods = [PeriodDSOut.from_orm(period) for period in periods_query]

    return periods

@periodds_router.get("/{periodds_id}", response={200: PeriodDSOut, 404: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_periodds_by_id(request, periodds_id: int):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view this periodds.")

    periodds = get_object_or_404(PeriodDS, id=periodds_id)

    return periodds

@periodds_router.put("/{periodds_id}", response=PeriodDSOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_periodds(request, periodds_id: int, payload: PeriodDSUpdate):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to update this periodds.")
    
    periodds = get_object_or_404(PeriodDS, id=periodds_id)

    for attribute, value in payload.dict(exclude_none=True).items():
        setattr(periodds, attribute, value)

    periodds.save()
    return periodds

@periodds_router.delete("/{periodds_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_periodds(request, periodds_id: int):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to delete this periodds.")
    
    periodds = get_object_or_404(PeriodDS, id=periodds_id)

    periodds.delete()
    return 204, None
