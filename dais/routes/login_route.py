from django.contrib.auth import authenticate
from django.conf import settings
import jwt
from datetime import datetime, timedelta
from ninja import Router, Query
from ninja.errors import HttpError
from dais.schemas.login_schema import AuthSchema, LoginResponseSchema
from django.utils import timezone

login_router = Router(tags=['Login'])

@login_router.post("/", response=LoginResponseSchema)
def login_post(request, auth_data: AuthSchema):
    return authenticate_user(auth_data.email, auth_data.password)

@login_router.get("/", response=LoginResponseSchema)
def login_get(request, email: str = Query(...), password: str = Query(...)):
    return authenticate_user(email, password)

def authenticate_user(email, password):
    user = authenticate(email=email, password=password)
    if not user:
        raise HttpError(401, "Invalid credentials")

    if not user.is_superuser:
        if not user.license or not user.license.active:
            raise HttpError(403, "License is inactive")

        if user.license.end_date and user.license.end_date < timezone.now().date():
            raise HttpError(403, "License has expired")

    expiration_time = datetime.utcnow() + timedelta(days=1)
    token = jwt.encode({
        'email': user.email,
        'exp': expiration_time,
        'user_id': user.id,
        'is_superuser': user.is_superuser,
        'is_staff': user.is_staff,
        'license_id': user.license_id,
    }, settings.SECRET_KEY, algorithm='HS256')

    return {
        "token": token,
        "user_id": user.id,
        "is_superuser": user.is_superuser,
        "is_staff": user.is_staff,
        "license_id": user.license_id,
    }
