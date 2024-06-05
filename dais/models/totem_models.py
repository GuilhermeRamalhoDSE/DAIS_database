from django.db import models
from django.utils.timezone import now
from .group_models import Group
from dais.models.screentype_models import ScreenType
from django.core.exceptions import ValidationError

class Totem(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, null=True)
    installation_date = models.DateField(null=True)
    active = models.BooleanField(default=False)
    comments = models.TextField(blank=True, null=True)
    last_update = models.DateTimeField(default=now)
    typology = models.ForeignKey(ScreenType,on_delete=models.CASCADE())

    def __str__(self):
        return self.name

    @property
    def screen_count(self):
        return self.screen_set.count()
    
    def clean(self):
        """
        Custom validation method for the model.
        Here, we'll check if adding this totem exceeds the limit defined in the license.
        """
        total_totems = self.group.client.license.total_totem
        if total_totems:
            current_totems_count = Totem.objects.exclude(id=self.id).filter(group__client=self.group.client).count()
            if current_totems_count >= total_totems:
                raise ValidationError("Limit of totems reached for this license.")

    def save(self, *args, **kwargs):
        """
        Overriding the save method to perform custom validation before saving the object.
        """
        self.clean()
        super().save(*args, **kwargs)