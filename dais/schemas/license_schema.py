from datetime import date
from typing import Optional  
from pydantic import BaseModel, validator
from typing import List, Optional
from .avatar_schema import AvatarSchema

class AvatarIdSchema(BaseModel):
    avatar_id: int

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

class LicenseSchema(LicenseBaseSchema):
    id: int
    avatars: List[AvatarSchema]

    @validator('avatars', pre=True, each_item=False)
    def prepare_avatars(cls, value):
        if value is None:
            return []
        return [AvatarSchema(id=avatar.id, name=avatar.name, voice=avatar.voice, file_path=avatar.file, last_update_date=avatar.last_update_date) for avatar in value.all()]

    class Config:
        from_attributes = True
