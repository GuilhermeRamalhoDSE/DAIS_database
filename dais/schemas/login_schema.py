from ninja import Schema
from typing import Optional
from datetime import datetime

class AuthSchema(Schema):
    email: str
    password: str

class LoginResponseSchema(Schema):
    token: str
    user_id: int
    is_superuser: bool
    is_staff: bool
    license_id: Optional[int] = None 
    last_login: Optional[datetime]
