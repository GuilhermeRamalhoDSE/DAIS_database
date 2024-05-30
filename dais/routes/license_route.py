from ninja import Router, Query
from typing import List
from django.shortcuts import get_object_or_404
from dais.models.license_models import License
from dais.models.avatar_models import Avatar
from dais.models.group_models import Group
from dais.models.voice_models import Voice 
from dais.models.language_models import Language 
from dais.models.module_models import Module
from dais.models.screentype_models import ScreenType
from dais.models.buttontype_models import ButtonType
from dais.schemas.avatar_schema import AvatarSchema
from dais.schemas.group_schema import GroupOut
from dais.schemas.language_schema import LanguageOut
from dais.schemas.voice_schema import VoiceOut
from dais.schemas.module_schema import ModuleOut
from dais.schemas.screentype_schema import ScreenTypeOut
from dais.schemas.buttontype_schema import ButtonTypeOut
from dais.schemas.license_schema import LicenseSchema, LicenseCreateSchema, LicenseUpdateSchema, AvatarIdSchema, VoiceIdSchema, LanguageIdSchema, ModuleIdSchema, ScreenTypeIdSchema, ButtonTypeIdSchema, UpdateTotemsSchema
from dais.auth import QueryTokenAuth, HeaderTokenAuth


license_router = Router(tags=['Licenses'])

@license_router.post("/", response={201: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_license(request, payload: LicenseCreateSchema):
    license_data = payload.dict(exclude={'avatars_id', 'voices_id', 'languages_id', 'modules_id', 'screentypes_id', 'buttontypes_id'})
    license_obj = License.objects.create(**license_data)
    
    return LicenseSchema.from_orm(license_obj)

@license_router.post("/{license_id}/add-avatar/", response={200: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def add_avatar_to_license(request, license_id: int, payload: AvatarIdSchema):
    license = get_object_or_404(License, id=license_id)
    avatar = get_object_or_404(Avatar, id=payload.avatar_id)
    
    license.avatars.add(avatar)
    
    return LicenseSchema.from_orm(license)

@license_router.post("/{license_id}/remove-avatar/", response={200: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def remove_avatar_from_license(request, license_id: int, payload: AvatarIdSchema):
    license = get_object_or_404(License, id=license_id)
    avatar = get_object_or_404(Avatar, id=payload.avatar_id)
    
    if license.avatars.filter(id=avatar.id).exists():
        license.avatars.remove(avatar)
    
    return LicenseSchema.from_orm(license)

@license_router.post("/{license_id}/add-voice/", response={200: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def add_voice_to_license(request, license_id: int, payload: VoiceIdSchema):
    license = get_object_or_404(License, id=license_id)
    voice = get_object_or_404(Voice, id=payload.voice_id)
    
    license.voices.add(voice)
    
    return LicenseSchema.from_orm(license)

@license_router.post("/{license_id}/remove-voice/", response={200: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def remove_voice_from_license(request, license_id: int, payload: VoiceIdSchema):
    license = get_object_or_404(License, id=license_id)
    voice = get_object_or_404(Voice, id=payload.voice_id)
    
    if license.voices.filter(id=voice.id).exists():
        license.voices.remove(voice)
    
    return LicenseSchema.from_orm(license)

@license_router.post("/{license_id}/add-language/", response={200: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def add_language_to_license(request, license_id: int, payload: LanguageIdSchema):
    license = get_object_or_404(License, id=license_id)
    language = get_object_or_404(Language, id=payload.language_id)
    
    license.languages.add(language)
    
    return LicenseSchema.from_orm(license)

@license_router.post("/{license_id}/remove-language/", response={200: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def remove_language_from_license(request, license_id: int, payload: LanguageIdSchema):
    license = get_object_or_404(License, id=license_id)
    language = get_object_or_404(Language, id=payload.language_id)
    
    if license.languages.filter(id=language.id).exists():
        license.languages.remove(language)
    
    return LicenseSchema.from_orm(license)

@license_router.post("/{license_id}/add-module/", response={200: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def add_module_to_license(request, license_id: int, payload: ModuleIdSchema):
    license = get_object_or_404(License, id=license_id)
    module = get_object_or_404(Module, id=payload.module_id)
    
    license.modules.add(module)
    
    return LicenseSchema.from_orm(license)

@license_router.post("/{license_id}/remove-module/", response={200: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def remove_module_from_license(request, license_id: int, payload: ModuleIdSchema):
    license = get_object_or_404(License, id=license_id)
    module = get_object_or_404(Module, id=payload.module_id)
    
    if license.modules.filter(id=module.id).exists():
        license.modules.remove(module)
    
    return LicenseSchema.from_orm(license)

@license_router.post("/{license_id}/add-screentype/", response={200: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def add_screentype_to_license(request, license_id: int, payload: ScreenTypeIdSchema):
    license = get_object_or_404(License, id=license_id)
    screentype = get_object_or_404(ScreenType, id=payload.screentype_id)
    
    license.screentypes.add(screentype)
    
    return LicenseSchema.from_orm(license)

@license_router.post("/{license_id}/remove-screentype/", response={200: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def remove_screentype_from_license(request, license_id: int, payload: ScreenTypeIdSchema):
    license = get_object_or_404(License, id=license_id)
    screentype = get_object_or_404(ScreenType, id=payload.screentype_id)
    
    if license.screentypes.filter(id=screentype.id).exists():
        license.screentypes.remove(screentype)
    
    return LicenseSchema.from_orm(license)

@license_router.post("/{license_id}/add-buttontype/", response={200: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def add_buttontype_to_license(request, license_id: int, payload: ButtonTypeIdSchema):
    license = get_object_or_404(License, id=license_id)
    buttontype = get_object_or_404(ButtonType, id=payload.buttontype_id)
    
    license.buttontypes.add(buttontype)
    
    return LicenseSchema.from_orm(license)

@license_router.post("/{license_id}/remove-buttontype/", response={200: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def remove_buttontype_from_license(request, license_id: int, payload: ButtonTypeIdSchema):
    license = get_object_or_404(License, id=license_id)
    buttontype = get_object_or_404(ButtonType, id=payload.buttontype_id)
    
    if license.buttontypes.filter(id=buttontype.id).exists():
        license.buttontypes.remove(buttontype)
    
    return LicenseSchema.from_orm(license)

@license_router.put("/{license_id}/update-totems/", response={200: LicenseSchema}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_totems(request, license_id: int, payload: UpdateTotemsSchema):
    license_obj = get_object_or_404(License, id=license_id)
    license_obj.total_totem = payload.total_totem
    license_obj.save()
    return LicenseSchema.from_orm(license_obj)

@license_router.get("/", response=List[LicenseSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_licenses(request, license_id: int = Query(None), name: str = Query(None)):
    filters = {}
    if license_id is not None:
        filters['id'] = license_id
    if name:
        filters['name__icontains'] = name

    licenses = License.objects.filter(**filters).order_by('id')
    return [LicenseSchema.from_orm(license) for license in licenses]

@license_router.get("/{license_id}/groups/", response=List[GroupOut])
def get_groups_by_license(request, license_id: int):
    license = get_object_or_404(License, id=license_id)
    groups = Group.objects.filter(client__license=license).distinct()
    return [GroupOut.from_orm(group) for group in groups]

@license_router.get("/{license_id}/avatars/", response=List[AvatarSchema], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_avatars_by_license(request, license_id: int):
    license = get_object_or_404(License, id=license_id)
    avatars = license.avatars.all()
    return [AvatarSchema.from_orm(avatar) for avatar in avatars]

@license_router.get("/{license_id}/languages/", response=List[LanguageOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_language_by_license(request, license_id: int):
    license = get_object_or_404(License, id=license_id)
    languages = license.languages.all()
    return [LanguageOut.from_orm(language) for language in languages]

@license_router.get("/{license_id}/voices/", response=List[VoiceOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_voice_by_license(request, license_id: int):
    license = get_object_or_404(License, id=license_id)
    voices = license.voices.all()
    return [VoiceOut.from_orm(voice) for voice in voices]

@license_router.get("/{license_id}/modules/", response=List[ModuleOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_module_by_license(request, license_id: int):
    license = get_object_or_404(License, id=license_id)
    modules = license.modules.all()
    return [ModuleOut.from_orm(module) for module in modules]

@license_router.get("/{license_id}/screentypes/", response=List[ScreenTypeOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_screentype_by_license(request, license_id: int):
    license = get_object_or_404(License, id=license_id)
    screentypes = license.screentypes.all()
    return [ScreenTypeOut.from_orm(screentype) for screentype in screentypes]

@license_router.get("/{license_id}/buttontypes/", response=List[ButtonTypeOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_buttontype_by_license(request, license_id: int):
    license = get_object_or_404(License, id=license_id)
    buttontypes = license.buttontypes.all()
    return [ScreenTypeOut.from_orm(buttontype) for buttontype in buttontypes]

@license_router.put("/{license_id}", response=LicenseSchema, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_license(request, license_id: int, payload: LicenseUpdateSchema):
    license_obj = get_object_or_404(License, id=license_id)
    for attr, value in payload.dict(exclude_unset=True).items():
        setattr(license_obj, attr, value)
    license_obj.save()
    return LicenseSchema.from_orm(license_obj)

@license_router.delete("/{license_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_license(request, license_id: int):
    license_obj = get_object_or_404(License, id=license_id)
    license_obj.delete()
    return {"success": True}
