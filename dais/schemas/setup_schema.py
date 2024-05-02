from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ScreenDetails(BaseModel):
    type: str
    logo_path: Optional[str]
    background_path: Optional[str]
    footer: Optional[str]

class TotemDetails(BaseModel):
    id: int
    name: str
    screen_count: int
    screens: List[ScreenDetails]

class GroupDetails(BaseModel):
    id: int
    name: str
    typology: str
    last_update: datetime

class SetupResponseSchema(BaseModel):
    group: GroupDetails
    totem: TotemDetails

class ErrorResponse(BaseModel):
    message: str
