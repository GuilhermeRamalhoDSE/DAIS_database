from django.db import models
from django.utils.translation import gettext_lazy as _

class ButtonType(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Nome"))

    class Meta:
        verbose_name = _("Tipologia Pulsante")
        verbose_name_plural = _("Tipologie Pulsanti")

    def __str__(self):
        return self.name
