from ninja.security import APIKeyQuery, HttpBearer
from ninja.errors import HttpError
from django.contrib.auth import get_user_model
import jwt
from django.conf import settings

User = get_user_model()

class AuthCheck:
    def authenticate(self, request, token: str = None):
        if not token:
            return None

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_email = payload.get("email")
            user = User.objects.get(email=user_email)

            if payload.get("is_superuser", False) != user.is_superuser:
                raise HttpError(403, "Access denied")

            return user
        except jwt.ExpiredSignatureError:
            raise HttpError(401, "Token has expired")
        except jwt.DecodeError:
            raise HttpError(401, "Error decoding token")
        except User.DoesNotExist:
            raise HttpError(401, "User does not exist")

class QueryTokenAuth(AuthCheck, APIKeyQuery):
    param_name: str = "token"

class HeaderTokenAuth(AuthCheck, HttpBearer):
    pass
