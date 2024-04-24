from pydantic import BaseModel

class ModuleIn(BaseModel):
    name: str

class ModuleOut(BaseModel):
    id: int
    name: str

