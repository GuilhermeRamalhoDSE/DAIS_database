from ninja import Router
from dais.models.module_models import Module
from dais.schemas.module_schema import ModuleIn, ModuleOut
from ninja.errors import HttpError
from dais.utils import check_super_user
from dais.auth import QueryTokenAuth, HeaderTokenAuth

module_router = Router(tags=["Modules"])

@module_router.post('/', response={201: ModuleOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_module(request, module_in: ModuleIn):
    if not check_super_user(request):
        raise HttpError(403, "Only superusers can create modules.")
    
    module = Module.objects.create(**module_in.dict())
    return 201, module

@module_router.get('/', response=list[ModuleOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_module(request):
    if not check_super_user(request):
        raise HttpError(403, "Only superusers can view modules.")
    
    module = Module.objects.all()
    return module

@module_router.get('/{module_id}', response={200: ModuleOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_module_by_id(request, module_id: int):
    if not check_super_user(request):
        raise HttpError(403, "Only superusers can view modules.")
    
    module = Module.objects.get(id=module_id)
    return module

@module_router.put('/{module_id}', response={200: ModuleOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def upadate_module(request, module_id: int, module_in: ModuleIn):
    if not check_super_user(request):
        raise HttpError(403, "Only superusers can update modules.")

    module = Module.objects.get(id=module_id)
    for attr, value in module_in.dict().items():
        setattr(module, attr, value)
    module.save()
    return module

@module_router.delete('/{module_id}', response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_module(request, module_id: int):
    if not check_super_user(request):
        raise HttpError(403, "Only superusers can delete modules.")

    module = Module.objects.get(id=module_id)
    module.delete()
    return 204, None   