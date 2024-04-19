from django.urls import path
from ninja import NinjaAPI
from .routes.license_route import license_router
from .routes.login_route import login_router
from .routes.password_reset_route import password_router
from .routes.user_route import user_router
from .routes.client_route import client_router
from .routes.avatar_route import avatar_router
from .routes.voice_route import voice_router
from .routes.language_route import language_router
from .routes.group_route import group_router
from .routes.totem_route import totem_router
from .routes.logs_route import log_router
from .routes.periodds_route import periodds_router
from .routes.periodia_route import periodia_router
from .routes.timeslots_route import timeslot_router
from .routes.contribution_route import contribution_router
from .routes.detail_route import detail_router
from .routes.layer_route import layer_router
from .routes.screen_route import screen_router


api = NinjaAPI()

api.add_router("/login", login_router)
api.add_router("/password", password_router)
api.add_router("/licenses", license_router)
api.add_router("/users", user_router)
api.add_router("/clients", client_router)
api.add_router("/avatar", avatar_router)
api.add_router("/voices", voice_router)
api.add_router("/languages", language_router)
api.add_router("/groups", group_router)
api.add_router("/totem", totem_router)
api.add_router("/screens", screen_router)
api.add_router("/logs", log_router)
api.add_router("/periodds", periodds_router)
api.add_router("/timeslot", timeslot_router)
api.add_router("/contributions", contribution_router)
api.add_router("/details", detail_router)
api.add_router("/periodia", periodia_router)
api.add_router("/layers", layer_router)

urlpatterns = [
    path("api/", api.urls),
]
