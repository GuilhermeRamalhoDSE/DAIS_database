from django.db import models
from django.utils.translation import gettext_lazy as _
from dais.models.form_models import Form

class FormData(models.Model):
    form =  models.ForeignKey(Form, on_delete=models.CASCADE, verbose_name=_('Form'))
    data = models.JSONField(verbose_name=_('Dato'))

    class Meta:
        verbose_name = _('Dato del form')
        verbose_name_plural = _('Dati del form')

    def __str__(self):
        return f'{self.form.name} - {self.id}'
    