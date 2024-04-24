from ninja import Router
from dais.models.screentype_models import ScreenType
from dais.schemas.screentype_schema import ScreenTypeIn, ScreenTypeOut
from ninja.errors import HttpError
from dais.utils import check_super_user
from dais.auth import QueryTokenAuth, HeaderTokenAuth

screentype_router = Router(tags=['Screen Types'])

@screentype_router.post('/', response={201: ScreenTypeOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_screen_type(request, screentype_in: ScreenTypeIn):
    if not check_super_user(request):
        raise HttpError(403, "Only superusers can create screen types.")
    
    screentype = ScreenType.objects.create(**screentype_in.dict())
    return 201, ScreenTypeOut.from_orm(screentype)

@screentype_router.get('/', response=list[ScreenTypeOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_screen_types(request):
    if not check_super_user(request):
        raise HttpError(403, "Only superusers can view screen types.")
    
    screentypes = ScreenType.objects.all().order_by('id')
    return [ScreenTypeOut.from_orm(screentype) for screentype in screentypes]

@screentype_router.get('/{screentype_id}', response={200: ScreenTypeOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_screen_type_by_id(request, screentype_id: int):
    if not check_super_user(request):
        raise HttpError(403, "Only superusers can view screen types.")
    
    screentype = ScreenType.objects.get(id=screentype_id)
    return ScreenTypeOut.from_orm(screentype)

@screentype_router.put('/{screentype_id}', response={200: ScreenTypeOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_screen_type(request, screentype_id: int, screentype_in: ScreenTypeIn):
    if not check_super_user(request):
        raise HttpError(403, "Only superusers can update screen types.")
    
    screentype = ScreenType.objects.get(id=screentype_id)
    for attr, value in screentype_in.dict().items():
        setattr(screentype, attr, value)
    screentype.save()
    return ScreenTypeOut.from_orm(screentype)

@screentype_router.delete('/{screentype_id}', response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_screen_type(request, screentype_id: int):
    if not check_super_user(request):
        raise HttpError(403, "Only superusers can delete screen types.")
    
    screentype = ScreenType.objects.get(id=screentype_id)
    screentype.delete()
    return 204, None