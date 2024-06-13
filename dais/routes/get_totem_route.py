from typing import Union
from ninja import Router
from ninja.responses import Response
from django.shortcuts import get_object_or_404
from dais.models.totem_models import Totem
from dais.models.group_models import Group
from dais.models.screen_models import Screen
from dais.models.form_models import Form
from dais.schemas.setup_schema import SetupResponseSchema, ScreenDetails, TotemDetails, GroupDetails, ErrorResponse, FormSchema
from django.db.models import Prefetch

get_totem_router = Router()

@get_totem_router.get("/{totem_id}", response=Union[SetupResponseSchema, ErrorResponse])
def get_totem(request, totem_id: int):
    totem = get_object_or_404(Totem, id=totem_id)
    group = get_object_or_404(
        Group.objects.prefetch_related(
            Prefetch('forms', queryset=Form.objects.prefetch_related('fields'))
        ),
        id=totem.group_id
    )

    screens = Screen.objects.filter(totem_id=totem_id)
    screen_details = [ScreenDetails(
        type=s.typology.name, 
    ) for s in screens]

    form_details = [FormSchema.from_orm(form) for form in group.forms.all()]

    totem_details = TotemDetails(
        id=totem.id, 
        name=totem.name, 
        last_update=totem.last_update, 
        screen_count=len(screens), 
        screens=screen_details
    )
    group_details = GroupDetails(
        id=group.id, 
        name=group.name, 
        typology=group.typology, 
        last_update=group.last_update,
        forms=form_details
    )

    response_data = SetupResponseSchema(group=group_details, totem=totem_details)
    return Response(response_data.dict(), status=200)
