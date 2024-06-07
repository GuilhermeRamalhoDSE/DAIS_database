from django.db import models
from dais.models.campaignds_models import CampaignDS

class TimeSlot(models.Model):
    campaignds = models.ForeignKey(CampaignDS, on_delete=models.CASCADE)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_random = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return f"{self.start_time} - {self.end_time}"
    
    @property
    def contributionds_count(self):
        return self.contributionds_set.count()