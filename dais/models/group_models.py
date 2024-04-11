from django.db import models
from django.utils.translation import gettext_lazy as _
from dais.models.license_models import License

class Group(models.Model):
    TYPOLOGY_CHOICES = [
        ('Artificial Intelligence', _('Intelligenza artificiale')),
        ('Digital Signage', _('Digital Signage')),
    ]

    license = models.ForeignKey(License, on_delete=models.CASCADE, verbose_name=_("Licenza"))
    name = models.CharField(max_length=255, verbose_name=_("Nome"))
    typology = models.CharField(max_length=24, choices=TYPOLOGY_CHOICES, verbose_name=_("Tipologia"))
    comments = models.TextField(blank=True, null=True, verbose_name=_("Commenti"))

    @property
    def total_totems(self):
        return self.totem_set.count()
    
    class Meta:
        verbose_name = _("Gruppo")
        verbose_name_plural = _("Gruppi")

    def __str__(self):
        return self.name
