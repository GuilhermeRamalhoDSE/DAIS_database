from datetime import date
from typing import Optional  
from pydantic import BaseModel, validator
from typing import List, Optional
from .avatar_schema import AvatarSchema
from .voice_schema import VoiceOut
from .language_schema import LanguageOut
from .module_schema import ModuleOut
from .screentype_schema import ScreenTypeOut
from .buttontype_schema import ButtonTypeOut

class UpdateTotemsSchema(BaseModel):
    total_totem: int

class AvatarIdSchema(BaseModel):
    avatar_id: int

class VoiceIdSchema(BaseModel):
    voice_id: int

class LanguageIdSchema(BaseModel):
    language_id: int

class ModuleIdSchema(BaseModel):
    module_id: int

class ScreenTypeIdSchema(BaseModel):
    screentype_id: int

class ButtonTypeIdSchema(BaseModel):
    buttontype_id: int
    
class LicenseBaseSchema(BaseModel):
    name: str
    email: str
    address: Optional[str] = None
    tel: Optional[str] = None
    license_code: str
    active: bool
    start_date: date
    end_date: date
    avatars_id: List[int] = [] 
    voices_id: List[int] = []
    languages_id: List[int] = []
    modules_id: List[int] = []
    screentypes_id: List[int] = []
    buttontypes_id: List[int] = []
    total_totem: int

class LicenseCreateSchema(LicenseBaseSchema):
    pass

class LicenseUpdateSchema(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    tel: Optional[str] = None
    license_code: Optional[str] = None
    active: Optional[bool] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    avatar_ids: Optional[List[int]] = None
    voice_ids: Optional[List[int]] = None
    language_ids: Optional[List[int]] = None
    module_ids: Optional[List[int]] = None
    screentype_ids: Optional[List[int]] = None
    buttontype_ids: Optional[List[int]] = None
    total_totem: Optional[int]

class LicenseSchema(LicenseBaseSchema):
    id: int
    avatars: List[AvatarSchema]
    voices: List[VoiceOut]
    languages: List[LanguageOut]
    modules: List[ModuleOut]
    screentypes: List[ScreenTypeOut]
    buttontypes: List[ButtonTypeOut]
    total_totem: int

    @validator('avatars', pre=True, each_item=False)
    def prepare_avatars(cls, value):
        if value is None:
            return []
        return [AvatarSchema(id=avatar.id, name=avatar.name, file_path=avatar.file, last_update_date=avatar.last_update_date) for avatar in value.all()]
    
    @validator('voices', pre=True, each_item=False)
    def prepare_voices(cls, value):
        if value is None:
            return []
        return [VoiceOut(id=voice.id, name=voice.name) for voice in value.all()]
    
    @validator('languages', pre=True, each_item=False)
    def prepare_languages(cls, value):
        if value is None:
            return []
        return [LanguageOut(id=language.id, name=language.name) for language in value.all()]

    @validator('modules', pre=True, each_item=False)
    def prepare_modules(cls, value):
        if value is None:
            return []
        return [ModuleOut(id=module.id, name=module.name, slug=module.slug) for module in value.all()]
    
    @validator('screentypes', pre=True, each_item=False)
    def prepare_screentypes(cls, value):
        if value is None:
            return []
        return [ScreenTypeOut(id=screentype.id, name=screentype.name) for screentype in value.all()]
    
    @validator('buttontypes', pre=True, each_item=False)
    def prepare_buttontypes(cls, value):
        if value is None:
            return []
        return [ButtonTypeOut(id=buttontype.id, name=buttontype.name) for buttontype in value.all()]
    
    class Config:
        from_attributes = True
