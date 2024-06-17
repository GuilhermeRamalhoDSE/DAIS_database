from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from django.utils.timezone import localtime


class ScreenDetails(BaseModel):
    type: str

class TotemDetails(BaseModel):
    id: int
    name: str
    last_update: datetime
    screen_count: int
    screens: List[ScreenDetails]

    class Config:
        json_encoders = {
            datetime: lambda v: localtime(v).strftime('%Y-%m-%d %H:%M:%S')
        }

class FormFieldSchema(BaseModel):
    id: int
    name: str
    number: int
    field_type: str
    required: bool

    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=obj.id,
            name=obj.name,
            number=obj.number,
            field_type=obj.field_type,
            required=obj.required
        )

class FormSchema(BaseModel):
    id: int
    client_module_id: int
    name: str
    last_update: datetime
    fields: List[FormFieldSchema]

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: localtime(v).strftime('%Y-%m-%d %H:%M:%S')
        }
    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=obj.id,
            client_module_id=obj.client_module_id,
            name=obj.name,
            last_update=obj.last_update,
            fields=[FormFieldSchema.from_orm(field) for field in obj.fields.all()]
        )

class GroupDetails(BaseModel):
    id: int
    name: str
    typology: str
    last_update: datetime
    forms: List[FormSchema]

    class Config:
        json_encoders = {
            datetime: lambda v: localtime(v).strftime('%Y-%m-%d %H:%M:%S')
        }

class SetupResponseSchema(BaseModel):
    group: GroupDetails
    totem: TotemDetails
    client_name: str  
    license_id: int

class ErrorResponse(BaseModel):
    message: str
