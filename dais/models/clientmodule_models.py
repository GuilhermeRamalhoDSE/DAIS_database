from django.db import models
from .client_models import Client
from .module_models import Module
from .group_models import Group

class ClientModule(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    module = models.ForeignKey(Module, on_delete=models.CASCADE,  null=True)
    groups = models.ManyToManyField(Group, blank=True)

    def __str__(self):
        if self.module:
            return self.module.name
        else:
            return "No module assigned"
    
    @property
    def form_count(self):
        return self.form_set.count()