from ninja import Router
from django.shortcuts import get_object_or_404
from typing import Optional, List
from dais.schemas.form_schema import FormCreateSchema, FormSchema, FormUpdateSchema
from dais.models.form_models import Form
from dais.models.clientmodule_models import ClientModule
from dais.models.client_models import Client
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token
from django.http import Http404

form_router = Router(tags=['Forms'])

@form_router.post('/', response={201: FormSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_form(request, form_in: FormCreateSchema):
    user_info = get_user_info_from_token(request)
    client_module = get_object_or_404(ClientModule, id=form_in.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to add forms')
    
    form_data = {**form_in.dict()}

    form = Form.objects.create(**form_data)

    form_schema = FormSchema.from_orm(form)

    return 201, form_schema

@form_router.get('/', response=List[FormSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_forms(request, client_module_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    client_module = get_object_or_404(ClientModule, id=client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to view forms')
    
    query = Form.objects.all()
    if client_module_id is not None:
        query = query.filter(client_module_id=client_module_id)
    
    forms = [FormSchema.from_orm(form) for form in query]
    return forms

@form_router.get('/get-forms/{client_id}', response=List[FormSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_forms_by_client(request, client_id: int):
    user_info = get_user_info_from_token(request)

    client = get_object_or_404(Client, id=client_id)
    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to view forms')

    client_modules = ClientModule.objects.filter(client=client)
    forms = Form.objects.filter(client_module__in=client_modules).distinct()

    return [FormSchema.from_orm(form) for form in forms]

@form_router.get('/{form_id}', response=FormSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_form_by_id(request, form_id: int):
    user_info = get_user_info_from_token(request)
    form = get_object_or_404(Form, id=form_id)
    client_module = get_object_or_404(ClientModule, id=form.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to view this form')
    
    return FormSchema.from_orm(form)

@form_router.put('/{form_id}', response=FormSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_form(request, form_id: int, form_in: FormUpdateSchema):
    user_info = get_user_info_from_token(request)
    form = get_object_or_404(Form, id=form_id)
    client_module = get_object_or_404(ClientModule, id=form.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to update this form')    

    for attr, value in form_in.dict().items():
        setattr(form, attr, value)
    
    form.save()
    return form

@form_router.delete('/{form_id}', response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_form(request, form_id: int):
    user_info = get_user_info_from_token(request)
    form = get_object_or_404(Form, id=form_id)
    client_module = get_object_or_404(ClientModule, id=form.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to delete this form')    
    
    form.delete()
    return 204, None