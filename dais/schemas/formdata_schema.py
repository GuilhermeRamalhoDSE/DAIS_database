from pydantic import BaseModel, Extra

class FormDataCreateSchema(BaseModel):
    form_id: int
    data: dict

    class Config:
        extra = Extra.allow
        
class FormDataSchema(BaseModel):
    id: int
    form_id: int
    data: dict

    class Config:
        from_attributes = True