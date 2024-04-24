from dais.models.totem_models import Totem
from dais.models.screen_models import Screen
from django.db import transaction

def duplicate_totem_and_screens(totem_id):
    with transaction.atomic():
        original_totem = Totem.objects.get(id=totem_id)

        totem_copy = Totem.objects.create(
            group=original_totem.group,
            name=f"Copy of {original_totem.name}",
            installation_date=original_totem.installation_date,
            active=original_totem.active,
            comments=original_totem.comments
        )

        screen = Screen.objects.filter(totem=original_totem)
        for screen in screen:
            Screen.objects.create(
                totem=totem_copy,
                typology=screen.typology,
                logo=screen.logo,
                background=screen.background,
                footer=screen.footer
            )

        return totem_copy