from ninja import Router
from typing import List, Optional
from django.shortcuts import get_object_or_404
from dais.models.layer_models import Layer
from dais.models.periodia_models import PeriodIA
from dais.schemas.layer_schema import LayerCreate, LayerUpdate, LayerOut
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token
from ninja.errors import HttpError


layer_router = Router(tags=["Layer"])

def has_permission(request, periodia):
    user_info = get_user_info_from_token(request)
    is_superuser = user_info.get('is_superuser', False)
    is_staff = user_info.get('is_staff', False)
    user_license_id = user_info.get('license_id')

    group_license_id = periodia.group.client.license_id

    return is_superuser or (is_staff and user_license_id == group_license_id)

@layer_router.post("/", response={201: LayerOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_layer(request, payload: LayerCreate):
    periodia = get_object_or_404(PeriodIA, id=payload.period_id)
    if not has_permission(request, periodia):
        raise HttpError(403, "You do not have permission to create a layer.")

    last_layer = Layer.objects.filter(period=periodia).order_by('-layer_number').first()
    next_layer_number = (last_layer.layer_number + 1) if last_layer else 1

    parent_layer = None
    if payload.parent_layer_number is not None and payload.parent_layer_number > 0:
        parent_layer = Layer.objects.filter(
            period=periodia,
            layer_number=payload.parent_layer_number
        ).first()
        if not parent_layer:
            raise HttpError(400, "Parent layer number does not exist.")

    layer = Layer.objects.create(
        period=periodia,
        layer_number=next_layer_number,
        parent=parent_layer,
        avatar_id=payload.avatar_id,
        name=payload.name,
        trigger=payload.trigger
    )
    return 201, LayerOut.from_orm(layer)

@layer_router.get("/{period_id}", response={200: List[LayerOut]}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_layers_by_period(request, period_id: int):
    periodia = get_object_or_404(PeriodIA, id=period_id)
    if not has_permission(request, periodia):
        raise HttpError(403, "You do not have permission to view layers for this period.")
    
    layers = Layer.objects.filter(period=periodia)
    return [LayerOut.from_orm(layer) for layer in layers]

@layer_router.get("/layer/{layer_id}", response={200: LayerOut, 404: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_layer_by_id(request, layer_id: int):
    layer = get_object_or_404(Layer, id=layer_id)
    periodia = get_object_or_404(PeriodIA, id=layer.period_id)
    if not has_permission(request, periodia):
        raise HttpError(403, "You do not have permission to view this layer.")

    return LayerOut.from_orm(layer)

@layer_router.put("/update/{layer_id}", response={200: LayerOut, 404: None, 403: None, 400: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_layer(request, layer_id: int, payload: LayerUpdate):
    layer = get_object_or_404(Layer, id=layer_id)
    
    periodia = get_object_or_404(PeriodIA, id=layer.period_id)
    if not has_permission(request, periodia):
        raise HttpError(403, "You do not have permission to update a layer.")

    for attribute, value in payload.dict(exclude_none=True).items():
        if attribute == 'parent_layer_number':
            if value is not None and value > 0:
                parent_layer = Layer.objects.filter(
                    period=layer.period,
                    layer_number=value
                ).first()
                if not parent_layer:
                    raise HttpError(400, "Parent layer number does not exist.")
                layer.parent = parent_layer
            else:
                layer.parent = None
        else:
            setattr(layer, attribute, value)

    layer.save()
    return LayerOut.from_orm(layer)

@layer_router.delete("/delete/{layer_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_layer(request, layer_id: int):
    layer = get_object_or_404(Layer, id=layer_id)
    periodia = get_object_or_404(PeriodIA, id=layer.period_id)
    if not has_permission(request, periodia):
        raise HttpError(403, "You do not have permission to delete a layer.")

    layer.delete()
    return 204, None
