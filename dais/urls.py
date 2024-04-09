from django.urls import path
from ninja import NinjaAPI
from .routes.license_route import license_router
from .routes.login_route import login_router


api = NinjaAPI()

api.add_router("/login", login_router)
api.add_router("/licenses", license_router)

urlpatterns = [
    path("api/", api.urls),
]
