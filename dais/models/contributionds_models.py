from django.db import models
from dais.models.timeslot_models import TimeSlot  
from django.utils.timezone import now

def contribuitionds_directory_path(instance, filename):
    return 'contributionDS_{0}/{1}/{2}'.format(instance.id, instance.created_at.strftime('%Y/%m/%d'), filename)

class ContributionDS(models.Model):
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, blank=True)
    file = models.FileField(upload_to=contribuitionds_directory_path)
    created_at = models.DateTimeField(default=now, blank=True)
    
    def __str__(self):
        return self.name