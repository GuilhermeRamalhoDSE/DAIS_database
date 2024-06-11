from pydantic import BaseModel
from typing import Optional
from dais.schemas.totem_schema import TotemOut
from dais.schemas.screentype_schema import ScreenTypeOut

class ScreenCreateSchema(BaseModel):
    totem_id: int
    typology_id: int

class ScreenUpdateSchema(BaseModel):
    totem_id: Optional[int] = None
    typology_id: Optional[int] = None

class ScreenOutSchema(BaseModel):
    id: int
    totem: TotemOut
    typology: ScreenTypeOut

    class Config:
        from_attributes = True
