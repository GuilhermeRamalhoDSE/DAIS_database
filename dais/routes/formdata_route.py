from ninja import Router
from django.shortcuts import get_object_or_404
from dais.models.form_models import Form
from dais.models.formdata_models import FormData
from dais.models.formfield_models import FormField
from dais.models.clientmodule_models import ClientModule
from dais.models.client_models import Client
from dais.schemas.formdata_schema import FormDataSchema
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token
from ninja.errors import HttpError
from django.http import Http404

formdata_router = Router(tags=['FormData'])

@formdata_router.post("/", response={201: FormDataSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_form_data(request, form_id: int, data: dict):
    user_info = get_user_info_from_token(request)
    form = get_object_or_404(Form, id=form_id)
    client_module = get_object_or_404(ClientModule, id=form.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)
    
    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to add data to this form')

    form_fields = FormField.objects.filter(form=form)
    required_fields = {field.name for field in form_fields if field.required}
    provided_fields = set(data.keys())
    
    missing_fields = required_fields - provided_fields
    if missing_fields:
        raise HttpError(400, f"Missing required fields: {', '.join(missing_fields)}")

    for field in form_fields:
        field_value = data.get(field.name)
        if field.field_type == 'Number' and not isinstance(field_value, (int, float, type(None))):
            raise HttpError(400, f"The field '{field.name}' should be numeric.")
        elif field.field_type == 'Text' and not isinstance(field_value, (str, type(None))):
            raise HttpError(400, f"The field '{field.name}' should be textual.")

    form_data = FormData.objects.create(form=form, data=data)
    return 201, FormDataSchema.from_orm(form_data)

@formdata_router.get("/{form_data_id}", response=FormDataSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_form_data(request, form_data_id: int):
    user_info = get_user_info_from_token(request)
    form_data = get_object_or_404(FormData, id=form_data_id)
    form = get_object_or_404(Form, id=form_data.form_id)
    client_module = get_object_or_404(ClientModule, id=form.client_module_id)
    client = get_object_or_404(Client, id=client_module.client_id)
    
    if not user_info.get('is_superuser') and str(client.license_id) != str(user_info.get('license_id')):
        raise Http404('You do not have permission to view this data')

    return FormDataSchema.from_orm(form_data)

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
