from typing import Union
from ninja import Router
from django.shortcuts import get_object_or_404
from dais.models.totem_models import Totem
from dais.models.group_models import Group
from dais.models.screen_models import Screen
from dais.schemas.setup_schema import SetupResponseSchema, ScreenDetails, TotemDetails, GroupDetails, ErrorResponse

get_totem_router = Router()

@get_totem_router.get("/{totem_id}", response=Union[SetupResponseSchema, ErrorResponse])
def setup_totem(request, totem_id: int):
    totem = get_object_or_404(Totem, id=totem_id)
    group = get_object_or_404(Group, id=totem.group_id)
    screens = Screen.objects.filter(totem_id=totem_id)
    screen_details = [
        ScreenDetails(
            type=s.typology.name, 
            logo_path=s.logo.url if s.logo else None,
            background_path=s.background.url if s.background else None,
            footer=s.footer
        ) for s in screens
    ]
    
    totem_details = TotemDetails(id=totem.id, name=totem.name, last_update=totem.last_update, screen_count=len(screens), screens=screen_details)
    group_details = GroupDetails(id=group.id, name=group.name, typology=group.typology, last_update=group.last_update)

    return SetupResponseSchema(group=group_details, totem=totem_details)
