from django.db import models
from dais.models.language_models import Language
from dais.models.layer_models import Layer
from django.utils.timezone import now

def contribuitionia_directory_path(instance, filename):
    return 'contributionAI_{0}/{1}/{2}'.format(instance.id, instance.created_at.strftime('%Y/%m/%d'), filename)

class ContributionAI(models.Model):
    layer = models.ForeignKey(Layer, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to=contribuitionia_directory_path, null=True, blank=True)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    TYPE_CHOICES = [
        ('VIDEO', 'Video'),  
        ('IMAGE', 'Image'),  
        ('3D', '3D') 
    ]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    trigger = models.CharField(max_length=255)
    last_update_date = models.DateTimeField(auto_now=True, null=True, blank=True)
    detail = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return self.name