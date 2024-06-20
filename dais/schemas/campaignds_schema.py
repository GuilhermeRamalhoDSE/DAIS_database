from datetime import date
from pydantic import BaseModel, Field, validator
from typing import Optional
from dais.schemas.group_schema import GroupOut
from datetime import datetime
from django.db.models.fields.files import FieldFile

class CampaignDSCreate(BaseModel):
    name: str
    group_id: int
    start_date: date
    end_date: date
    active: bool
    logo_path: Optional[str] = Field(None, alias='logo')
    background_path: Optional[str] = Field(None, alias='background')
    footer: Optional[str] = None

class CampaignDSUpdate(BaseModel):
    name: Optional[str] = None
    group_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    active: Optional[bool] = None
    logo_path: Optional[str] = Field(None, alias='logo')
    background_path: Optional[str] = Field(None, alias='background')
    footer: Optional[str] = None

class CampaignDSOut(BaseModel):
    id: int
    name: str
    group: GroupOut
    start_date: date
    end_date: date
    last_update: datetime
    active: bool
    logo_path: Optional[str] = Field(None, alias='logo')
    background_path: Optional[str] = Field(None, alias='background')
    footer: Optional[str] = None
    created_at: datetime
    
    @validator('background_path', pre=True, always=True)
    def convert_background_to_url(cls, v):
        if isinstance(v, FieldFile):
            return v.url if v.name else None
        return v
    
    @validator('logo_path', pre=True, always=True)
    def convert_logo_to_url(cls, v):
        if isinstance(v, FieldFile):
            return v.url if v.name else None
        return v

    class Config:
        from_attributes = True
