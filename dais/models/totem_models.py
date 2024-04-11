from django.db import models
from django.utils.translation import gettext_lazy as _
from .license_models import License
from .client_models import Client
from .group_models import Group


class Totem(models.Model):
    license = models.ForeignKey(License, on_delete=models.CASCADE, verbose_name=_("Licenza"))
    client = models.ForeignKey(Client, on_delete=models.CASCADE, verbose_name=_("Cliente"))  
    group = models.ForeignKey(Group, on_delete=models.CASCADE, verbose_name=_("Gruppo"))
    installation_date = models.DateField(verbose_name=_("Data di installazione"))
    active = models.BooleanField(default=True, verbose_name=_("Attivo"))
    screens = models.IntegerField(verbose_name=_("Schermi"))
    comments = models.TextField(blank=True, null=True, verbose_name=_("Commenti"))

    class Meta:
        verbose_name = _("Totem")
        verbose_name_plural = _("Totems")

    def __str__(self):
        return f"Totem {self.id} - {self.group.name}"
