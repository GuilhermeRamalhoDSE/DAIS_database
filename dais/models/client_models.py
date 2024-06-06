from django.db import models
from dais.models.license_models import License

class Client(models.Model):
    license = models.ForeignKey(License, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    active = models.BooleanField(default=True) 

    def __str__(self):
        return self.name