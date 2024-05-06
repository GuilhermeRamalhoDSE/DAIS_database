from ninja import Router
from django.shortcuts import get_object_or_404
from typing import Optional, List
from dais.schemas.formfield_schema import FormFieldCreateSchema, FormFieldSchema, FormFieldUpdateSchema
from dais.models.formfield_models import FormField
from dais.models.form_models import Form
from dais.models.clientmodule_models import ClientModule
from dais.models.client_models import Client
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token
from django.http import Http404

form_field_router = Router(tags= ['Form Fields'])

@form_field_router.post('/', response={201: FormFieldSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_form_field(request, form_field_in: FormFieldCreateSchema):
    user_info = get_user_info_from_token(request)
    form = get_object_or_404(Form, id=form_field_in.form_id)
    client_module = get_object_or_404(ClientModule, id=form.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to add fields to this form')
    
    form_field_data = {**form_field_in.dict()}

    form_field = Form.objects.create(**form_field_data)

    form_field_schema = FormFieldSchema.from_orm(form_field)

@form_field_router.get('/', response=List[FormFieldSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_form_fields(request, form_id: Optional[int] = None):
    user_info = get_user_info_from_token(request)
    form = get_object_or_404(Form, id=form_id)
    client_module = get_object_or_404(ClientModule, id=form.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to view the fields of this form')
    
    query = FormField.objects.all()
    if form_id is not None:
        query = query.filter(form_id=form_id)
    
    form_fields = [FormFieldSchema.from_orm(form_field) for form_field in query]
    return form_fields

@form_field_router.get('/{form_field_id}', response=FormFieldSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_form_field_by_id(request, form_field_id: int):
    user_info = get_user_info_from_token(request)
    form_field = get_object_or_404(FormField, id=form_field_id)
    form = get_object_or_404(Form, id=form_field.form_id)
    client_module = get_object_or_404(ClientModule, id=form.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to view this field of this form')
    
    return FormFieldSchema.from_orm(form_field)

@form_field_router.put('/{form_field_id}', response=FormFieldSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_form_field(request, form_field_id: int, form_field_in: FormFieldUpdateSchema):
    user_info = get_user_info_from_token(request)
    form_field = get_object_or_404(FormField, id=form_field_id)
    form = get_object_or_404(Form, id=form_field.form_id)
    client_module = get_object_or_404(ClientModule, id=form.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to update this field of this form')
    
    for attr, value in form_field_in.dict().items():
        setattr(form_field, attr, value)

    form_field.save()
    return form_field

@form_field_router.delete('/{form_field_id}', response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_form_field(request, form_field_id: int):
    user_info = get_user_info_from_token(request)
    form_field = get_object_or_404(FormField, id=form_field_id)
    form = get_object_or_404(Form, id=form_field.form_id)
    client_module = get_object_or_404(ClientModule, id=form.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)

    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to delete this field of this form')   
    
    form_field.delete()
    return 204, None