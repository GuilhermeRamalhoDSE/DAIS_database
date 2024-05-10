from datetime import datetime
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from django.db.models.fields.files import FieldFile

class LanguageOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class LayerOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class ContributionIABaseSchema(BaseModel):
    name: str
    file_path: Optional[str] = Field(None, alias='file')
    language_id: int
    layer_id: int
    type: str
    trigger: str
    detail: Optional[str] = None

class ContributionIACreateSchema(ContributionIABaseSchema):
    pass

class ContributionIAUpdateSchema(BaseModel):
    name: Optional[str] = None
    file_path: Optional[str] = Field(None, alias='file')
    language_id: Optional[int] = None
    layer_id: Optional[int] = None
    type: Optional[str] = None
    trigger: Optional[str] = None
    detail: Optional[str] = None

class ContributionIASchema(BaseModel):
    id: int
    name: str
    file_path: Optional[str] = Field(None, alias='file')
    language: LanguageOut
    layer_id: int
    type: str
    trigger: str
    detail: Optional[str] = None
    last_update_date: datetime
    created_at: datetime

    @validator('file_path', pre=True, always=True)
    def convert_file_to_url(cls, v):
        if isinstance(v, FieldFile) and v.name:
            return v.url
        return v

    class Config:
        from_attributes = True


