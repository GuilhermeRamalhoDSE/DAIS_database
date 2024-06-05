from django.db import models
from django.utils.translation import gettext_lazy as _
from dais.models.campaignai_models import CampaignAI
from dais.models.avatar_models import Avatar

class Layer(models.Model):
    period = models.ForeignKey(CampaignAI, on_delete=models.CASCADE, verbose_name=_("Id periodoia"))
    layer_number = models.IntegerField(verbose_name=_("Numero del layer"))
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children', verbose_name=_("Parente"))
    avatar = models.ForeignKey(Avatar, on_delete=models.CASCADE, verbose_name=_("Id avatar"))
    name = models.CharField(max_length=255, verbose_name=_("Nome"))
    last_update_date = models.DateTimeField(auto_now=True, verbose_name=_("Data dell'ultima aggiornamento"))
    trigger = models.CharField(max_length=255, verbose_name=_("Trigger"))

    class Meta:
        verbose_name = _("Layer")
        verbose_name_plural = _("Layers")

    def __str__(self):
        return f"{self.name} (Layer {self.layer_number}) - Last Updated: {self.last_update_date.strftime('%Y-%m-%d')}"
