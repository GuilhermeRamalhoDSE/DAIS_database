from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime

class ScreenBaseSchema(BaseModel):
    totem_id: int
    typology: str
    logo_path: Optional[str] = None 
    background_path: Optional[str] = None  
    footer: Optional[str] = None

class ScreenCreateSchema(ScreenBaseSchema):
    pass

class ScreenUpdateSchema(BaseModel):
    totem_id: Optional[int] = None
    typology: Optional[str] = None
    logo_path: Optional[str] = None  
    background_path: Optional[str] = None  
    footer: Optional[str] = None

class ScreenOutSchema(BaseModel):
    id: int
    totem_id: int
    typology: str
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
