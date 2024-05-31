from ninja import Router
from django.shortcuts import get_object_or_404
from dais.models.form_models import Form
from dais.models.formdata_models import FormData
from dais.models.clientmodule_models import ClientModule
from dais.models.client_models import Client
from dais.schemas.formdata_schema import FormDataSchema, FormDataCreateSchema
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token
from django.http import Http404
from typing import Optional, List
from django.http import HttpRequest, JsonResponse

formdata_router = Router(tags=['FormData'])

@formdata_router.get("/{form_id}", response={201: FormDataSchema})
def create_form_data(request: HttpRequest, form_id: int):
    try:
        form = get_object_or_404(Form, id=form_id)
        
        query_params = dict(request.GET.items())  
        
        form_data = FormData.objects.create(
            form=form,
            data=query_params
        )
        
        return JsonResponse(FormDataSchema.from_orm(form_data).dict(), status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@formdata_router.get("/", response=List[FormDataSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_form_data(request,  form_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    form = get_object_or_404(Form, id=form_id)
    client_module = get_object_or_404(ClientModule, id=form.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)
    
    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to view this data')

    query = FormData.objects.all()
    if form_id is not None:
        query = query.filter(form_id=form_id)
    return [FormDataSchema.from_orm(data) for data in query]

@formdata_router.delete("/{form_data_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_form_data(request, form_data_id: int):
    user_info = get_user_info_from_token(request)
    form_data = get_object_or_404(FormData, id=form_data_id)
    form = get_object_or_404(Form, id=form_data.form_id)
    client_module = get_object_or_404(ClientModule, id=form.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)
    
    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to delete this data')
    
    form_data.delete()
    return 204, None
