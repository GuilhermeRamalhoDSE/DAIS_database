from pydantic import BaseModel

class ButtonTypeIn(BaseModel):
    name: str

class ButtonTypeOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True