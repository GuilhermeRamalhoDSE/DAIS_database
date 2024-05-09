from pydantic import BaseModel, validator
from typing import Optional, List
from dais.schemas.module_schema import ModuleOut
from .group_schema import GroupOut

class GroupIdSchema(BaseModel):
    group_id: int

class ClientModuleCreateSchema(BaseModel):
    client_id: int
    name: str
    module_id: int
    groups_id: List[int] = []

class ClientModuleUpdateSchema(BaseModel):
    client_id: Optional[int] = None
    name: Optional[str] = None
    module_id: Optional[int] = None
    group_ids: Optional[List[int]] = None

class ClientModuleSchema(BaseModel):
    id: int
    client_id: int
    name: str
    module: ModuleOut
    form_count: int
    groups: List[GroupOut]

    @validator('groups', pre=True, each_item=False)
    def prepare_groups(cls, value):
        if value is None:
            return []
        return [
            GroupOut(
                id=group.id,
                client_id=group.client_id,
                client_name=GroupOut.resolve_client_name(group), 
                name=group.name,
                typology=group.typology,
                last_update=group.last_update,
                total_totems=GroupOut.resolve_total_totems(group),  
                comments=group.comments,
                forms=group.forms
            ) for group in value.all()
        ]


    class Config:
        from_attributes = True