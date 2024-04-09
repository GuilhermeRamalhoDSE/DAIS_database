from pydantic import BaseModel

class ResetPasswordData(BaseModel):
    new_password: str
