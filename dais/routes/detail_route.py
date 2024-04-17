from typing import Optional, List
from ninja import Router, File, Query
from ninja.files import UploadedFile
from ninja.errors import HttpError
from django.shortcuts import get_object_or_404
from dais.models.detail_models import Detail
from dais.models.contribution_models import Contribution
from dais.models.timeslot_models import TimeSlot
from dais.schemas.detail_schema import DetailSchema, DetailCreateSchema, DetailUpdateSchema
from django.http import HttpRequest, FileResponse, Http404
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token, check_user_permission
import os, random
from django.core.files.storage import default_storage

detail_router = Router(tags=['Detail'])

@detail_router.post("/", response={201: DetailSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_detail(request: HttpRequest, detail_in: DetailCreateSchema, file: UploadedFile = File(...)):
    user_info = get_user_info_from_token(request)
    is_superuser = user_info.get('is_superuser', False)
    is_staff = user_info.get('is_staff', False)

    if not (is_superuser or is_staff):
        raise HttpError(403, "Only superusers or admins can create details.")
    
    detail = Detail.objects.create(
        name=detail_in.name,
        file=file,
        contribution_id=detail_in.contribution_id
    )

    detail_schema = DetailSchema.from_orm(detail)
    
    return 201, detail_schema

@detail_router.get("/", response=List[DetailSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_details(request, contribution_id: Optional[int] = None):
    if not check_user_permission(request):
        raise HttpError(403, "You do not have permission to view these details.")
    
    user_info = get_user_info_from_token(request)
    license_id = user_info.get('license_id')

    if not contribution_id:
        raise HttpError(400, "Contribution ID is required.")
    
    if license_id is not None:
        contribution = get_object_or_404(
            Contribution.objects.select_related('time_slot__period__group__client__license'), 
            id=contribution_id,
            time_slot__period__group__client__license__id=license_id
        )
    else:
        contribution = get_object_or_404(Contribution, id=contribution_id)
    
    details_query = Detail.objects.filter(contribution=contribution)

    if contribution.is_random:
        details = list(details_query)
        random.shuffle(details)
    else:
        details = details_query.order_by('id')
    
    return [DetailSchema.from_orm(detail) for detail in details]

@detail_router.get("/{detail_id}", response=DetailSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_detail_by_id(request, detail_id: int):
    user_info = get_user_info_from_token(request)
    user_license_id = str(user_info.get('license_id'))
    is_superuser = user_info.get('is_superuser', False)

    detail = get_object_or_404(Detail, id=detail_id)
    detail_license_id = str(detail.contribution.time_slot.period.group.client.license_id)

    if is_superuser or detail_license_id == user_license_id:
        return DetailSchema.from_orm(detail)
    else:
        raise HttpError(403, "You do not have permission to view this detail.")

@detail_router.get("/download/{detail_id}", auth=[QueryTokenAuth(), HeaderTokenAuth()])
def download_detail_file(request, detail_id: int):
    user_info = get_user_info_from_token(request)
    is_superuser = user_info.get('is_superuser', False)
    user_license_id = str(user_info.get('license_id'))

    detail = get_object_or_404(Detail, id=detail_id)

    detail_license_id = str(detail.contribution.time_slot.period.group.client.license_id)

    if is_superuser or detail_license_id == user_license_id:
        if detail.file and hasattr(detail.file, 'path'):
            file_path = detail.file.path
            if os.path.exists(file_path):
                return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=os.path.basename(file_path))
            else:
                raise Http404("File does not exist.")
        else:
            raise Http404("No file associated with this detail.")
    else:
        raise Http404("You do not have permission to download this file.")

@detail_router.put("/{detail_id}", response=DetailSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_detail(request, detail_id: int, detail_in: DetailUpdateSchema, file: UploadedFile = File(None)):
    user_info = get_user_info_from_token(request)
    detail = get_object_or_404(Detail, id=detail_id)
    contribution = get_object_or_404(Contribution, id=detail.contribution_id)
    time_slot = get_object_or_404(TimeSlot, id=contribution.time_slot_id)

    if not user_info.get('is_superuser') and str(time_slot.period.group.client.license_id) != str(user_info.get('license_id')):
        raise Http404("You do not have permission to update this detail.")
    
    for attr, value in detail_in.dict(exclude_none=True).items():
        setattr(detail, attr, value)

    if file and detail.file:
        if default_storage.exists(detail.file.name):
            default_storage.delete(detail.file.name)
    
    if file:
        detail.file = file

    detail.save()
    return detail

@detail_router.delete("/{detail_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_detail(request, detail_id: int):
    user_info = get_user_info_from_token(request)
    detail = get_object_or_404(Detail, id=detail_id)
    contribution = get_object_or_404(Contribution, id=detail.contribution_id)
    time_slot = get_object_or_404(TimeSlot, id=contribution.time_slot_id)

    if not user_info.get('is_superuser') and str(time_slot.period.group.client.license_id) != str(user_info.get('license_id')):
        raise Http404("You do not have permission to delete this detail.")
    
    if detail.file:
        file_path = detail.file.path
        if os.path.exists(file_path):
            os.remove(file_path)
    
    detail.delete()
    return 204, None
