from datetime import datetime
from pydantic import BaseModel, Field, validator
from typing import Optional
from django.db.models.fields.files import FieldFile

class AvatarBaseSchema(BaseModel):
    name: str
    voice: str
    license_id: int
    file_path: Optional[str] = Field(None, alias='file')

class AvatarCreateSchema(AvatarBaseSchema):
    pass

class AvatarUpdateSchema(BaseModel):
    name: Optional[str] = None
    voice: Optional[str] = None
    file_path: Optional[str] = Field(None, alias='file')

class AvatarSchema(BaseModel):
    id: int
    name: str
    voice: str
    file_path: Optional[str] = Field(None, alias='file')
    last_update_date: datetime

    @validator('file_path', pre=True, always=True)
    def convert_file_to_url(cls, v):
        if isinstance(v, FieldFile) and v.name:  
            return v.url
        return v  

    class Config:
        from_attributes = True
