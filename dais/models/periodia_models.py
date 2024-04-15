from django.db import models
from django.utils.translation import gettext_lazy as _

from dais.models.group_models import Group

class PeriodIA(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, verbose_name=_("Gruppo"))
    start_date = models.DateField(verbose_name=_("Data di inizio"))
    end_date = models.DateField(verbose_name=_("Data di fine"))
    last_update = models.DateTimeField(auto_now=True, verbose_name=_("Data dell'ultimo aggiornamento"))
    active = models.BooleanField(default=True, verbose_name=_("Attivo"))

    class Meta:
        verbose_name = _("PeriodoIA")
        verbose_name_plural = _("PeriodiIA")

    def __str__(self):
        return f"{self.group} - {self.start_date} to {self.end_date}"
