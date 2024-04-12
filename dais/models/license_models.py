from django.db import models
from django.utils.translation import gettext_lazy as _
from dais.models.avatar_models import Avatar
from dais.models.voice_models import Voice
from dais.models.language_models import Language

class License(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Nome"))
    email = models.EmailField(unique=True, verbose_name=_("Email"))
    address = models.CharField(max_length=255, verbose_name=_("Indirizzo"), null=True, blank=True)
    tel = models.CharField(max_length=20, verbose_name=_("Telefono"), null=True, blank=True)
    license_code = models.CharField(max_length=100, unique=True, verbose_name=_("Codice Licenza"))
    active = models.BooleanField(default=True, verbose_name=_("Attivo"))
    start_date = models.DateField(verbose_name=_("Data Inizio"))
    end_date = models.DateField(verbose_name=_("Data Scadenza"))
    avatars = models.ManyToManyField(Avatar, verbose_name=_("Avatares"), blank=True)
    voices = models.ManyToManyField(Voice, verbose_name=_("Voci"), blank=True)
    languages = models.ManyToManyField(Language, verbose_name=_("Lingue"), blank=True)

    class Meta:
        verbose_name = _("Gestione Licenza")
        verbose_name_plural = _("Gestione Licenze")

    def __str__(self):
        return self.name
