from django.db import models
from django.utils.translation import gettext_lazy as _
from dais.models.timeslot_models import TimeSlot  

class Contribution(models.Model):
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE, verbose_name=_("ID Orario"))
    
    def __str__(self):
        return f"{self.time_slot} - {self.detail_count} dettagli"

    @property
    def detail_count(self):
        return self.detail_set.count()

    class Meta:
        verbose_name = _("Contributo")
        verbose_name_plural = _("Contributi")
