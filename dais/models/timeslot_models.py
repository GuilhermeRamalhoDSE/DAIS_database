from django.db import models
from django.utils.translation import gettext_lazy as _
from dais.models.periodds_models import PeriodDS

class TimeSlot(models.Model):
    period = models.ForeignKey(PeriodDS, on_delete=models.CASCADE, verbose_name=_("ID Periodo"))
    start_time = models.TimeField(verbose_name=_("Ora di inizio"))
    end_time = models.TimeField(verbose_name=_("Ora di fine"))

    def __str__(self):
        return f"{self.start_time} - {self.end_time}"

    class Meta:
        verbose_name = _("Fascia Oraria")
        verbose_name_plural = _("Fasce Orarie")
