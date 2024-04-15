from django.db import models
from django.utils.translation import gettext_lazy as _
from dais.models.totem_models import Totem

class Log(models.Model):
    TYPOLOGY_CHOICES = [
        ('Artificial Intelligence', _('Intelligenza artificiale')),
        ('Digital Signage', _('Digital Signage')),
    ]

    totem = models.ForeignKey(Totem, on_delete=models.CASCADE, verbose_name=_("Totem"))
    date = models.DateTimeField(auto_now_add=True, verbose_name=_("Data"))
    typology = models.CharField(max_length=24, choices=TYPOLOGY_CHOICES, verbose_name=_("Tipologia"))
    information = models.TextField(verbose_name=_("Informazioni"))

    class Meta:
        verbose_name = _("Log")
        verbose_name_plural = _("Logs")

    def __str__(self):
        return f"{self.totem.name} - {self.date.strftime('%Y-%m-%d %H:%M')} - {self.typology}"
