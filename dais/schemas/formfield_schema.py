from pydantic import BaseModel
from typing import Optional

class FormFieldCreateSchema(BaseModel):
    form_id: int
    name: str
    number: int
    field_type: str
    required: bool = False

class FormFieldUpdateSchema(BaseModel):
    form_id: Optional[int] = None
    name: Optional[str] = None
    number: Optional[int] = None
    field_type: Optional[str] = None
    required: Optional[bool] = None

class FormFieldSchema(BaseModel):
    id: int
    form_id: int
    name: str
    number: int
    field_type: str
    required: bool

    class Config:
        from_attributes = True

