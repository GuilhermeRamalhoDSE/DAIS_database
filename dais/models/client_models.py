from django.db import models
from django.utils.translation import gettext_lazy as _
from dais.models.license_models import License

class Client(models.Model):
    license = models.ForeignKey(License, on_delete=models.CASCADE, verbose_name=_("licenza"))
    name = models.CharField(max_length=255, verbose_name=_("nome"))
    email = models.EmailField(verbose_name=_("email"))
    address = models.CharField(max_length=255, verbose_name=_("indirizzo"))
    phone = models.CharField(max_length=20, verbose_name=_("telefono"))
    active = models.BooleanField(default=True, verbose_name=_("attivo")) 

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Cliente")
        verbose_name_plural = _("Clienti")
