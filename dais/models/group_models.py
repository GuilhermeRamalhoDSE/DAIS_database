from django.db import models
from django.utils.timezone import now
from dais.models.client_models import Client
from dais.models.module_models import Module

class Group(models.Model):
    TYPOLOGY_CHOICES = [
        ('Artificial Intelligence', 'Artificial Intelligence'),
        ('Digital Signage', 'Digital Signage'),
    ]

    client = models.ForeignKey(Client, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=255)
    typology = models.CharField(max_length=24, choices=TYPOLOGY_CHOICES)
    comments = models.TextField(blank=True, null=True)
    last_update = models.DateTimeField(default=now)
    forms = models.ManyToManyField('dais.Form', blank=True)

    def update_last_update(self):
        self.last_update = now()
        self.save()

    @property
    def total_totems(self):
        return self.totem_set.count()

    @property
    def modules(self):
        return Module.objects.filter(clientmodule__groups=self).distinct()

    def __str__(self):
        return self.name
