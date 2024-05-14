from django.db import models
from django.utils.translation import gettext_lazy as _
from dais.models.form_models import Form

class FormField(models.Model):
    FIELD_TYPES = [
        ('Text', _('Testo')),
        ('Number', _('Numero')),
        ('Date', _('Data'))
    ]
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name='fields', verbose_name=_('Form'))
    name = models.CharField(max_length=255, verbose_name=_('Nome'))
    number = models.IntegerField(verbose_name=_('Numero'))
    field_type = models.CharField(max_length=50, choices=FIELD_TYPES, default='text', verbose_name=_('Tipo di Campo'))
    required = models.BooleanField(default=False, verbose_name=_('Obbligatorio'))

    class Meta:
        verbose_name = _('Campo di Form')
        verbose_name_plural = _('Campi di Form')
        ordering = ['number']

    def __self__(self):
        return f'{self.number} - {self.name}' 