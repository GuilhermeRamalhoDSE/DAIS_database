from ninja import Schema
from typing import Optional, List
from dais.schemas.grouptype_schema import GroupTypeOut
from dais.models.client_models import Client 
from datetime import datetime
from django.shortcuts import get_object_or_404
from .form_schema import FormSchema

class FormIdSchema(Schema):
    form_id: int

class GroupCreate(Schema):
    client_id: int  
    name: str
    typology_id: int 
    comments: Optional[str] = None
    forms_id: List[int] = []

class GroupUpdate(Schema):
    client_id: Optional[int] = None  
    name: Optional[str] = None
    typology_id: Optional[int] = None
    comments: Optional[str] = None
    form_ids: Optional[List[int]] = None

class LastUpdateOut(Schema):
    last_update: datetime

class GroupOut(Schema):
    id: int
    client_id: int
    client_name: str  
    name: str
    typology: GroupTypeOut
    last_update: datetime
    total_totems: Optional[int] = None
    comments: Optional[str] = None
    forms: List[FormSchema]
    needs_update: bool

    @staticmethod
    def resolve_client_name(obj):
        if hasattr(obj, 'client_id'):
            client = get_object_or_404(Client, id=obj.client_id)
            return client.name
        return "Unknown Client"

    @staticmethod
    def resolve_total_totems(obj):
        return obj.total_totems  