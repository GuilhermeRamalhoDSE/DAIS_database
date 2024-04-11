from ninja import Router
from typing import List, Optional
from django.shortcuts import get_object_or_404
from dais.models.totem_models import Totem  # Assumindo o nome do modelo
from dais.schemas.totem_schema import TotemCreate, TotemUpdate, TotemOut  # Assumindo os nomes dos schemas
from ninja.errors import HttpError
from dais.auth import QueryTokenAuth, HeaderTokenAuth
from dais.utils import get_user_info_from_token

totem_router = Router(tags=["Totem"])

@totem_router.post("/", response={201: TotemOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_totem(request, payload: TotemCreate):
    user_info = get_user_info_from_token(request)
    # Validação de permissão pode ser necessária aqui
    totem = Totem.objects.create(**payload.dict())
    return 201, totem

@totem_router.get("/", response=List[TotemOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_totems(request):
    user_info = get_user_info_from_token(request)
    # Implementação de filtragem com base na licença do usuário ou permissões
    totems = Totem.objects.all()
    return list(totems)

@totem_router.get("/{totem_id}", response={200: TotemOut, 404: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def get_totem_by_id(request, totem_id: int):
    user_info = get_user_info_from_token(request)
    # Validação de permissão pode ser necessária aqui
    totem = get_object_or_404(Totem, id=totem_id)
    return 200, totem

@totem_router.put("/{totem_id}", response=TotemOut, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_totem(request, totem_id: int, payload: TotemUpdate):
    user_info = get_user_info_from_token(request)
    # Validação de permissão pode ser necessária aqui
    totem = get_object_or_404(Totem, id=totem_id)
    for attr, value in payload.dict(exclude_unset=True).items():
        setattr(totem, attr, value)
    totem.save()
    return totem

@totem_router.delete("/{totem_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_totem(request, totem_id: int):
    user_info = get_user_info_from_token(request)
    # Validação de permissão pode ser necessária aqui
    totem = get_object_or_404(Totem, id=totem_id)
    totem.delete()
    return 204, None
