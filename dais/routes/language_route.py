from ninja import Router
from dais.models.language_models import Language
from dais.schemas.language_schema import LanguageIn, LanguageOut
from ninja.errors import HttpError
from dais.utils import check_user_permission
from dais.auth import QueryTokenAuth, HeaderTokenAuth

language_router = Router(tags=["Languages"])

@language_router.post("/", response={201: LanguageOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_language(request, payload: LanguageIn):
    if not check_user_permission(request):
        raise HttpError(403, "Only superusers can create languages.")
    
    language = Language.objects.create(**payload.dict())
    return 201, language

@language_router.get("/{language_id}", response={200: LanguageOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_language(request, language_id: int):
    if not check_user_permission(request):
        raise HttpError(403, "Only superusers can view language details.")
    
    language = Language.objects.get(id=language_id)
    return language

@language_router.get("/", response=list[LanguageOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def list_languages(request):
    if not check_user_permission(request):
        raise HttpError(403, "Only superusers can list languages.")
    
    languages = Language.objects.all()
    return languages

@language_router.put("/{language_id}", response={200: LanguageOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_language(request, language_id: int, payload: LanguageIn):
    if not check_user_permission(request):
        raise HttpError(403, "Only superusers can update languages.")
    
    language = Language.objects.get(id=language_id)
    for attr, value in payload.dict().items():
        setattr(language, attr, value)
    language.save()
    return language

@language_router.delete("/{language_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_language(request, language_id: int):
    if not check_user_permission(request):
        raise HttpError(403, "Only superusers can delete languages.")
    
    language = Language.objects.get(id=language_id)
    language.delete()
    return {}
