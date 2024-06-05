from django.db import models
from dais.models.group_models import Group

class CampaignAI(models.Model):
    name = models.CharField(max_length=255)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    last_update = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
