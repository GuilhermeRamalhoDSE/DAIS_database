from django.db import models
from dais.models.group_models import Group
from django.utils.timezone import now

def campaign_file_path(instance, filename):
    return f'CampaignAI_{instance.id}/{instance.created_at.strftime("%Y/%m/%d")}/{filename}'

class CampaignAI(models.Model):
    name = models.CharField(max_length=255)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    last_update = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)
    logo = models.FileField(upload_to=campaign_file_path, null=True, blank=True)
    background = models.FileField(upload_to=campaign_file_path, null=True, blank=True)
    footer = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(default=now) 

    def __str__(self):
        return self.name
