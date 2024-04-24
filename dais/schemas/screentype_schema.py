from pydantic import BaseModel

class ScreenTypeIn(BaseModel):
    name: str

class ScreenTypeOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True