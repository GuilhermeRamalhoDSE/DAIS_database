from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from django.utils.timezone import localtime


class ScreenDetails(BaseModel):
    type: str
    logo_path: Optional[str]
    background_path: Optional[str]
    footer: Optional[str]

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

class GroupDetails(BaseModel):
    id: int
    name: str
    typology: str
    last_update: datetime

    class Config:
        json_encoders = {
            datetime: lambda v: localtime(v).strftime('%Y-%m-%d %H:%M:%S')
        }

class SetupResponseSchema(BaseModel):
    group: GroupDetails
    totem: TotemDetails

class ErrorResponse(BaseModel):
    message: str
