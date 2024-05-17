from ninja import Router
from dais.models.buttontype_models import ButtonType
from dais.schemas.buttontype_schema import ButtonTypeIn, ButtonTypeOut
from ninja.errors import HttpError
from dais.utils import check_super_user
from dais.auth import QueryTokenAuth, HeaderTokenAuth

buttontype_router = Router(tags=['Button Types'])

@buttontype_router.post('/', response={201: ButtonTypeOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_button_type(request, buttontype_in: ButtonTypeIn):
    if not check_super_user(request):
        raise HttpError(403, "Only superusers can create button types.")
    
    buttontype = ButtonType.objects.create(**buttontype_in.dict())
    return 201, ButtonTypeOut.from_orm(buttontype)

@buttontype_router.get('/', response=list[ButtonTypeOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_button_types(request):
    if not check_super_user(request):
        raise HttpError(403, "Only superusers can view button types.")
    
    buttontypes = ButtonType.objects.all().order_by('id')
    return [ButtonTypeOut.from_orm(buttontype) for buttontype in buttontypes]

@buttontype_router.get('/{buttontype_id}', response={200: ButtonTypeOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_button_type_by_id(request, buttontype_id: int):
    if not check_super_user(request):
        raise HttpError(403, "Only superusers can view button types.")
    
    buttontype = ButtonType.objects.get(id=buttontype_id)
    return ButtonTypeOut.from_orm(buttontype)

@buttontype_router.put('/{buttontype_id}', response={200: ButtonTypeOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_button_type(request, buttontype_id: int, buttontype_in: ButtonTypeIn):
    if not check_super_user(request):
        raise HttpError(403, "Only superusers can update button types.")
    
    buttontype = ButtonType.objects.get(id=buttontype_id)
    for attr, value in buttontype_in.dict().items():
        setattr(buttontype, attr, value)
    buttontype.save()
    return ButtonTypeOut.from_orm(buttontype)

@buttontype_router.delete('/{buttontype_id}', response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_button_type(request, buttontype_id: int):
    if not check_super_user(request):
        raise HttpError(403, "Only superusers can delete button types.")
    
    buttontype = ButtonType.objects.get(id=buttontype_id)
    buttontype.delete()
    return 204, None