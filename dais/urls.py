from django.urls import path
from ninja import NinjaAPI
from .routes.license_route import license_router
from .routes.login_route import login_router
from .routes.password_reset_route import password_router
from .routes.user_route import user_router
from .routes.client_route import client_router
from .routes.avatar_route import avatar_router


api = NinjaAPI()

api.add_router("/login", login_router)
api.add_router("/password", password_router)
api.add_router("/licenses", license_router)
api.add_router("/users", user_router)
api.add_router("/clients", client_router)
api.add_router("/avatar", avatar_router)

urlpatterns = [
    path("api/", api.urls),
]
