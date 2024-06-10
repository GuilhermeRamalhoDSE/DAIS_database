from datetime import datetime
from ninja import Schema
from typing import Optional, List
from dais.schemas.avatar_schema import AvatarSchema


class LayerCreate(Schema):
    campaignai_id: int
    parent_layer_number: Optional[int] = None  
    avatar_id: int
    name: str
    trigger: str

class LayerUpdate(Schema):
    campaignai_id: Optional[int] = None
    layer_number: Optional[int] = None
    parent_layer_number: Optional[int] = None  
    avatar_id: Optional[int] = None
    name: Optional[str] = None
    trigger: Optional[str] = None

class LayerOut(Schema):
    id: int
    campaignai_id: int
    layer_number: int
    parent: Optional[int] = None 
    avatar: AvatarSchema
    name: str
    last_update_date: datetime
    trigger: str
    children: List[int] = []  

    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=obj.id,
            campaignai_id=obj.campaignai_id,
            layer_number=obj.layer_number,
            parent=obj.parent.layer_number if obj.parent else None,  
            avatar=obj.avatar,
            name=obj.name,
            last_update_date=obj.last_update_date,
            trigger=obj.trigger,
            children=[child.layer_number for child in obj.children.all()]  
        )

LayerOut.update_forward_refs()
