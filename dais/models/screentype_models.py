from django.db import models
from django.utils.translation import gettext_lazy as _

class ScreenType(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Nome"))

    class Meta:
        verbose_name = _('Tipologia Schermo')
        verbose_name_plural = _('Tipologie Schermi')

    def __str__(self):
        return self.name