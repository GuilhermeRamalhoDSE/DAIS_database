from django.db import models
from django.utils.translation import gettext_lazy as _
from dais.models.license_models import License
from dais.models.client_models import Client
from dais.models.module_models import Module

class Form(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, verbose_name=_('Clienti'))
    module = models.ForeignKey(Module, on_delete=models.CASCADE, verbose_name=_("Modulo"))
    name = models.CharField(max_length=255, verbose_name=_("Nome"))
    last_update = models.DateTimeField(auto_now=True, verbose_name=_("Data Dell'ultimo aggiornamento"))
    api = models.BooleanField(default=False, verbose_name=_('API'))

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Form")