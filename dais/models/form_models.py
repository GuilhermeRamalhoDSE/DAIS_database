from django.db import models
from dais.models.clientmodule_models import ClientModule


class Form(models.Model):
    client_module = models.ForeignKey(ClientModule, null=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    last_update = models.DateTimeField(auto_now=True)
    api = models.BooleanField(default=False)

    def __str__(self):
        return self.name