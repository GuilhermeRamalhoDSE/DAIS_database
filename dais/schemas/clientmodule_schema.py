from pydantic import BaseModel, validator
from typing import Optional, List
from dais.schemas.module_schema import ModuleOut
from dais.schemas.group_schema import GroupOut

class GroupIdSchema(BaseModel):
    group_id: int

class ClientModuleCreateSchema(BaseModel):
    client_id: int
    module_id: int
    groups_id: List[int] = []

class ClientModuleUpdateSchema(BaseModel):
    client_id: Optional[int] = None
    module_id: Optional[int] = None
    group_ids: Optional[List[int]] = None

class ClientModuleSchema(BaseModel):
    id: int
    client_id: int
    module: Optional[ModuleOut]
    form_count: int
    groups: List[GroupOut]

    @validator('module')
    def validate_module(cls, value):
        if value is None:
            return "No module assigned"
        return value

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

