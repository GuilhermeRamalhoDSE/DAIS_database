from ninja import Schema
from typing import Optional
from ninja.errors import ValidationError
from dais.models.client_models import Client 
from datetime import datetime
from django.shortcuts import get_object_or_404

class GroupCreate(Schema):
    client_id: int  
    name: str
    typology: str 
    comments: Optional[str] = None

    @classmethod
    def validate_typology(cls, value):
        valid_typologies = ["Artificial Intelligence", "Digital Signage"]
        if value not in valid_typologies:
            raise ValidationError(f"Invalid typology value: {value}. Valid options are: {valid_typologies}")
        return value

class GroupUpdate(Schema):
    client_id: Optional[int] = None  
    name: Optional[str] = None
    typology: Optional[str] = None
    comments: Optional[str] = None

class LastUpdateOut(Schema):
    last_update: datetime

class GroupOut(Schema):
    id: int
    client_id: int
    client_name: str  
    name: str
    typology: str
    last_update: datetime
    total_totems: Optional[int] = None
    comments: Optional[str] = None

    @staticmethod
    def resolve_client_name(obj):
        if hasattr(obj, 'client_id'):
            client = get_object_or_404(Client, id=obj.client_id)
            return client.name
        return "Unknown Client"

    @staticmethod
    def resolve_total_totems(obj):
        return obj.total_totems  