from pydantic import BaseModel, validator, Field
from typing import Optional
from dais.schemas.buttontype_schema import ButtonTypeOut
from dais.schemas.form_schema import FormSchema
from django.db.models.fields.files import FieldFile

class ButtonCreateSchema(BaseModel):
    interaction_id: int
    name: str
    button_type_id: int
    url: Optional[str] = None
    form_id: Optional[int] = None
    file_path: Optional[str] = Field(None, alias='file')

class ButtonUpdateSchema(BaseModel):
    interaction_id: Optional[int] = None
    name: Optional[str] = None
    button_type_id: Optional[int] = None
    url: Optional[str] = None
    form_id: Optional[int] = None
    file_path: Optional[str] = Field(None, alias='file')

class ButtonSchema(BaseModel):
    id: int
    interaction_id: int
    name: str
    button_type: ButtonTypeOut
    url: Optional[str] = None
    form: Optional[FormSchema] = None
    file_path: Optional[str] = None

    @classmethod
    def from_orm(cls, obj):
        if hasattr(obj, 'file') and obj.file and hasattr(obj.file, 'url') and obj.file.url:
            file_path = obj.file.url
        else:
            file_path = None
        return cls(
            id=obj.id,
            interaction_id=obj.interaction_id,
            name=obj.name,
            button_type=obj.button_type,
            url=obj.url,
            form=obj.form,
            file_path=file_path
        )