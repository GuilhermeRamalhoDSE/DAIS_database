from datetime import datetime
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from django.db.models.fields.files import FieldFile

class LayerOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class LanguageOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class VoiceOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class FormationCreateSchema(BaseModel):
    layer_id: int
    name: str
    file_path: Optional[str] = Field(None, alias='file')
    voice_id: int
    language_id: int
    trigger: str

class FormationUpdateSchema(BaseModel):
    layer_id: Optional[int] = None
    name: Optional[str] = None
    file_path: Optional[str] = Field(None, alias='file')
    voice_id: Optional[int] = None
    language_id: Optional[int] = None
    trigger: Optional[str] = None

class FormationSchema(BaseModel):
    id: int
    name: str
    file_path: Optional[str] = Field(None, alias='file')
    layer_id: int
    voice: VoiceOut
    language: LanguageOut
    trigger: str
    last_update_date: datetime
    created_at: datetime

    @validator('file_path', pre=True, always=True)
    def convert_fiel_to_url(cls,v):
        if isinstance(v, FieldFile) and v.name:
            return v.url
        return v
    
    class Config:
        from_attributes = True