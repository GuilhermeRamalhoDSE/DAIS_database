from pydantic import BaseModel
from typing import Optional
from dais.schemas.buttontype_schema import ButtonTypeOut
from dais.schemas.form_schema import FormSchema

class ButtonCreateSchema(BaseModel):
    interaction_id: int
    name: str
    button_type_id: int
    url: Optional[str] = None
    form_id: Optional[int] = None
    file_path: Optional[str] = None

class ButtonUpdateSchema(BaseModel):
    interaction_id: Optional[int] = None
    name: Optional[str] = None
    button_type_id: Optional[int] = None
    url: Optional[str] = None
    form_id: Optional[int] = None
    file_path: Optional[str] = None

class ButtonSchema(BaseModel):
    id: int
    interaction_id: int
    name: str
    button_type: ButtonTypeOut
    url: Optional[str] = None
    form: Optional[FormSchema] = None
    file_path: Optional[str] = None

    class Config:
        from_attributes = True
