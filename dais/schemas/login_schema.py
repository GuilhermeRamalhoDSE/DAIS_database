from ninja import Schema
from typing import Optional

class AuthSchema(Schema):
    email: str
    password: str

class LoginResponseSchema(Schema):
    token: str
    user_id: int
    is_superuser: bool
    is_admin: bool
    license_id: Optional[int] = None 
