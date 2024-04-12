from ninja import Schema

class LanguageIn(Schema):
    name: str

class LanguageOut(Schema):
    id: int
    name: str
