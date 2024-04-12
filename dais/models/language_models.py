from django.db import models
from django.utils.translation import gettext_lazy as _

class Language(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Nome"))

    class Meta:
        verbose_name = _("Lingua")
        verbose_name_plural = _("Lingue")

    def __str__(self):
        return self.name
