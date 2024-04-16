from datetime import datetime
from pydantic import BaseModel, Field, validator
from typing import Optional
from django.db.models.fields.files import FieldFile

class DetailBaseSchema(BaseModel):
    order: str

class DetailCreateSchema(DetailBaseSchema):
    contribution_id: int

class DetailUpdateSchema(BaseModel):
    order: Optional[str] = None
    file_path: Optional[str] = Field(None, alias='file')

class DetailSchema(BaseModel):
    id: int
    contribution_id: int
    order: str
    file_path: Optional[str] = Field(None, alias='file')
    creation_date: Optional[datetime] = None
    last_modified_date: Optional[datetime] = None

    @validator('file_path', pre=True, always=True)
    def convert_file_to_url(cls, v):
        if isinstance(v, FieldFile) and v.name:
            return v.url
        return v

    class Config:
        from_attributes = True
