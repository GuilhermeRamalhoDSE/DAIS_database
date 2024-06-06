from pydantic import BaseModel, Field, validator
from typing import Optional
from dais.schemas.timeslot_schema import TimeSlotOutSchema
from django.db.models.fields.files import FieldFile

class ContributionDSCreateSchema(BaseModel):
    time_slot_id: int
    name: str
    file_path: Optional[str] = Field(None, alias='file')

class ContributionDSUpdateSchema(BaseModel):
    time_slot_id: Optional[int] = None
    name: Optional[str] = None
    file_path: Optional[str] = Field(None, alias='file')

class ContributionDSOutSchema(BaseModel):
    id: int
    time_slot: TimeSlotOutSchema
    name: str
    file_path: Optional[str] = Field(None, alias='file')

    @staticmethod
    def resolve_time_slot_id(obj):
        return obj.time_slot.id

    @validator('file_path', pre=True, always=True)
    def convert_fiel_to_url(cls,v):
        if isinstance(v, FieldFile) and v.name:
            return v.url
        return v
    
    class Config:
        from_attributes = True

