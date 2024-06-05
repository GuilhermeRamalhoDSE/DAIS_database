from django.db import models
from dais.models.campaignds_models import CampaignDS

class TimeSlot(models.Model):
    period = models.ForeignKey(CampaignDS, on_delete=models.CASCADE)
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.start_time} - {self.end_time}"