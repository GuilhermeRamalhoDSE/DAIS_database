from ninja import Schema

class VoiceIn(Schema):
    name: str

class VoiceOut(Schema):
    id: int
    name: str
