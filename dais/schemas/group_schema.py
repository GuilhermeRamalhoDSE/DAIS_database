from ninja import Schema
from typing import Optional
from ninja.errors import ValidationError

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

class GroupOut(Schema):
    id: int
    client_id: int
    client_name: str  
    name: str
    typology: str
    total_totems: int 
    comments: Optional[str] = None

    @staticmethod
    def resolve_client_name(obj):
        return obj.client.name if hasattr(obj, 'client') and obj.client else "Unknown Client"

    @staticmethod
    def resolve_total_totems(obj):
        return obj.total_totems  