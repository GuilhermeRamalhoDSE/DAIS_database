from django.db import models
from dais.models.totem_models import Totem
from dais.models.screentype_models import ScreenType

class Screen(models.Model):
    totem = models.ForeignKey(Totem, on_delete=models.CASCADE, null=True)
    typology = models.ForeignKey(ScreenType,on_delete=models.CASCADE())
    
    def __str__(self):
        return f"{self.typology} - {self.totem.name}"
