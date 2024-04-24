from datetime import date
from typing import Optional  
from pydantic import BaseModel, validator
from typing import List, Optional
from .avatar_schema import AvatarSchema
from .voice_schema import VoiceOut
from .language_schema import LanguageOut
from .module_schema import ModuleOut

class AvatarIdSchema(BaseModel):
    avatar_id: int

class VoiceIdSchema(BaseModel):
    voice_id: int

class LanguageIdSchema(BaseModel):
    language_id: int

class ModuleIdSchema(BaseModel):
    module_id: int
    
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

class LicenseSchema(LicenseBaseSchema):
    id: int
    avatars: List[AvatarSchema]
    voices: List[VoiceOut]
    languages: List[LanguageOut]
    modules: List[ModuleOut]

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
        return [ModuleOut(id=module.id, name=module.name) for module in value.all()]
    
    class Config:
        from_attributes = True
