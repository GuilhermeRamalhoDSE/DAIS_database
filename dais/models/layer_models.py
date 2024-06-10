from django.db import models
from dais.models.campaignai_models import CampaignAI
from dais.models.avatar_models import Avatar

class Layer(models.Model):
    campaignai = models.ForeignKey(CampaignAI, on_delete=models.CASCADE)
    layer_number = models.IntegerField()
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    avatar = models.ForeignKey(Avatar, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    last_update_date = models.DateTimeField(auto_now=True)
    trigger = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} (Layer {self.layer_number}) - Last Updated: {self.last_update_date.strftime('%Y-%m-%d')}"
