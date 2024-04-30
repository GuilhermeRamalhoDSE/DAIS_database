from django.db import models
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from dais.models.client_models import Client

class Group(models.Model):
    TYPOLOGY_CHOICES = [
        ('Artificial Intelligence', _('Intelligenza artificiale')),
        ('Digital Signage', _('Digital Signage')),
    ]

    client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True, verbose_name=_("Cliente"))
    name = models.CharField(max_length=255, verbose_name=_("Nome"))
    typology = models.CharField(max_length=24, choices=TYPOLOGY_CHOICES, verbose_name=_("Tipologia"))
    comments = models.TextField(blank=True, null=True, verbose_name=_("Commenti"))
    last_update = models.DateTimeField(default=now, verbose_name=_("Data dell'ultimo aggiornamento"))

    @property
    def total_totems(self):
        return self.totem_set.count()
    
    class Meta:
        verbose_name = _("Gruppo")
        verbose_name_plural = _("Gruppi")

    def __str__(self):
        return self.name
