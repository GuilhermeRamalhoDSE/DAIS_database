from pydantic import BaseModel
from typing import Dict, Any

class FormDataCreateSchema(BaseModel):
    form_id: int
    data: Dict[str, Any]

class FormDataSchema(BaseModel):
    id: int
    form_id: int
    data: Dict[str, Any]

    class Config:
        from_attributes = True