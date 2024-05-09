from django.db import models
from django.utils.translation import gettext_lazy as _
from .client_models import Client
from .module_models import Module
from .group_models import Group

class ClientModule(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, verbose_name=_('Cliente'))
    module = models.ForeignKey(Module, on_delete=models.CASCADE,  null=True, verbose_name=_('Modulo'))
    name = models.CharField(max_length=255, verbose_name=_('Nome'))
    groups = models.ManyToManyField(Group, verbose_name=_('Gruppi'), blank=True)

    def __str__(self):
        return self.name
    
    @property
    def form_count(self):
        return self.form_set.count()
    
    class Meta:
        verbose_name = _('Modulo Cliente')
        verbose_name_plural = _('Moduli Clienti')
