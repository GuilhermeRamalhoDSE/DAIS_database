from ninja import Schema

class GroupTypeIn(Schema):
    name: str

class GroupTypeOut(Schema):
    id: int
    name: str