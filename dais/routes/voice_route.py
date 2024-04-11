from ninja import Router
from dais.models.voice_models import Voice  
from dais.schemas.voice_schema import VoiceIn, VoiceOut 
from ninja.errors import HttpError
from dais.utils import check_user_permission
from dais.auth import QueryTokenAuth, HeaderTokenAuth

voice_router = Router(tags=["Voices"])

@voice_router.post("/", response={201: VoiceOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def create_voice(request, payload: VoiceIn):
    if not check_user_permission(request):
        raise HttpError(403, "Only superusers can create voices.")
    
    voice = Voice.objects.create(**payload.dict())
    return 201, voice

@voice_router.get("/{voice_id}", response={200: VoiceOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def read_voice(request, voice_id: int):
    if not check_user_permission(request):
        raise HttpError(403, "Only superusers can view voice details.")
    
    voice = Voice.objects.get(id=voice_id)
    return voice

@voice_router.get("/", response=list[VoiceOut], auth=[QueryTokenAuth(), HeaderTokenAuth()])
def list_voices(request):
    if not check_user_permission(request):
        raise HttpError(403, "Only superusers can list voices.")
    
    voices = Voice.objects.all()
    return voices

@voice_router.put("/{voice_id}", response={200: VoiceOut}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def update_voice(request, voice_id: int, payload: VoiceIn):
    if not check_user_permission(request):
        raise HttpError(403, "Only superusers can update voices.")
    
    voice = Voice.objects.get(id=voice_id)
    for attr, value in payload.dict().items():
        setattr(voice, attr, value)
    voice.save()
    return voice

@voice_router.delete("/{voice_id}", response={204: None}, auth=[QueryTokenAuth(), HeaderTokenAuth()])
def delete_voice(request, voice_id: int):
    if not check_user_permission(request):
        raise HttpError(403, "Only superusers can delete voices.")
    
    voice = Voice.objects.get(id=voice_id)
    voice.delete()
    return {}
