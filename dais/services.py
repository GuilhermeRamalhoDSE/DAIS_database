from dais.models.totem_models import Totem
from dais.models.screen_models import Screen
from django.db import transaction
from django.core.exceptions import ValidationError

def duplicate_totem_and_screens(totem_id):
    with transaction.atomic():
        original_totem = Totem.objects.get(id=totem_id)

        total_totems = original_totem.group.client.license.total_totem
        current_totems_count = Totem.objects.filter(group=original_totem.group).count()
        if total_totems and current_totems_count >= total_totems:
            raise ValidationError("Limit of totems reached for this license.")

        totem_copy = Totem.objects.create(
            group=original_totem.group,
            name=f"Copy of {original_totem.name}",
            installation_date=None,
            active=False,
            comments=original_totem.comments
        )

        screen = Screen.objects.filter(totem=original_totem)
        for screen_item in screen:
            Screen.objects.create(
                totem=totem_copy,
                typology=screen_item.typology,
                logo=screen_item.logo,
                background=screen_item.background,
                footer=screen_item.footer
            )

        return totem_copy
