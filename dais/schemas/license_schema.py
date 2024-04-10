from datetime import date
from typing import Optional  
from pydantic import BaseModel
from typing import List, Optional

class AvatarSchema(BaseModel):
    id: int
    url: str
    name: str

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

    @classmethod
    def from_orm(cls, obj):
        obj_data = obj.__dict__.copy()
        obj_data['avatars'] = [
            {'id': avatar.id, 'url': avatar.url, 'name': avatar.name} for avatar in obj.avatars.all()
        ]
        return cls(**obj_data)

    class Config:
        from_attributes = True
