from django.db import models
from dais.models.totem_models import Totem
from dais.models.license_models import License

class Log(models.Model):
    TYPOLOGY_CHOICES = [
        ('Artificial Intelligence', 'AI'),
        ('Digital Signage', 'DS'),
    ]

    license = models.ForeignKey(License, on_delete=models.CASCADE)
    totem = models.ForeignKey(Totem, on_delete=models.CASCADE, default=None)
    date = models.DateTimeField(auto_now_add=True)
    typology = models.CharField(max_length=24, choices=TYPOLOGY_CHOICES)
    information = models.TextField()
    client = models.CharField(max_length=100, blank=True, default='')
    campaign = models.CharField(max_length=100, blank=True, default='')
    logtype = models.CharField(max_length=100, blank=True, default='')

    def __str__(self):
        return f"{self.totem.name} - {self.date.strftime('%Y-%m-%d %H:%M')} - {self.typology}"
