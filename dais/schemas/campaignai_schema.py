from datetime import date, datetime
from pydantic import BaseModel, validator
from typing import Optional
from dais.schemas.group_schema import GroupOut

class CampaignAICreate(BaseModel):
    name: str
    group_id: int
    start_date: date
    end_date: date
    active: bool
    logo_path: Optional[str] = None 
    background_path: Optional[str] = None  
    footer: Optional[str] = None
    
class CampaignAIUpdate(BaseModel):
    name: Optional[str] = None
    group_id: Optional[int] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    active: Optional[bool] = None
    logo_path: Optional[str] = None 
    background_path: Optional[str] = None  
    footer: Optional[str] = None

class CampaignAIOut(BaseModel):
    id: int
    group: GroupOut
    start_date: date
    end_date: date
    last_update: datetime
    active: bool
    logo_path: Optional[str] = None 
    background_path: Optional[str] = None  
    footer: Optional[str] = None
    created_at: datetime
    
    @validator('background_path', pre=True, always=True)
    def convert_background_to_url(cls, v):
        if v:
            return v.url
        return v
    
    @validator('logo_path', pre=True, always=True)
    def convert_logo_to_url(cls, v):
        if v:
            return v.url
        return v

    class Config:
        from_attributes = True
