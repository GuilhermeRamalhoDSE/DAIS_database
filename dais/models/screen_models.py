from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now
from dais.models.totem_models import Totem
from dais.models.screentype_models import ScreenType

def screen_file_path(instance, filename):
    return f'screens/totem_{instance.totem_id}/{instance.created_at.strftime("%Y/%m/%d")}/{filename}'

class Screen(models.Model):
    totem = models.ForeignKey(Totem, on_delete=models.CASCADE, verbose_name=_("Id totem"), null=True)
    typology = models.ForeignKey(ScreenType,on_delete=models.CASCADE, verbose_name=_("Tipologia"))
    logo = models.FileField(upload_to=screen_file_path, null=True, blank=True, verbose_name=_("Logo"))
    background = models.FileField(upload_to=screen_file_path, null=True, blank=True, verbose_name=_("Sfondo"))
    footer = models.CharField(max_length=255, blank=True, null=True, verbose_name=_("Footer"))
    created_at = models.DateTimeField(default=now, verbose_name=_("Data di creazione"))

    class Meta:
        verbose_name = _("Schermo")
        verbose_name_plural = _("Schermi")

    def __str__(self):
        return f"{self.typology} - {self.totem.name}"
