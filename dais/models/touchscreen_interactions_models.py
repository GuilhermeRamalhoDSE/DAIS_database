from django.db import models
from django.utils.timezone import now
from dais.models.clientmodule_models import ClientModule

class TouchScreenInteractions(models.Model):
    client_module = models.ForeignKey(ClientModule, null=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    last_update = models.DateTimeField(default=now)

    @property
    def total_buttons(self):
        return self.button_set.count()

    def __str__(self):
        return self.name