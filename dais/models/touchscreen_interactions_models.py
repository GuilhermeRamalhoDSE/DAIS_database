from django.db import models
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from dais.models.clientmodule_models import ClientModule

class TouchScreenInteractions(models.Model):
    client_module = models.ForeignKey(ClientModule, null=True, on_delete=models.CASCADE, verbose_name=_('Moduli Clienti'))
    name = models.CharField(max_length=255, verbose_name=_("Nome"))
    last_update = models.DateTimeField(default=now, verbose_name=_("Data dell'ultimo aggiornamento"))

    @property
    def total_buttons(self):
        return self.buttons_set.count()

    class Meta:
        verbose_name = _('Modulo CLiente')
        verbose_name_plural = _('Moduli CLienti')

    def __str__(self):
        return self.name