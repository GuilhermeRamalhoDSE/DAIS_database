from django.db import models
from dais.models.layer_models import Layer
from dais.models.voice_models import Voice
from dais.models.language_models import Language
from django.utils.timezone import now

def formation_directory_path(instance, filename):
    return 'formation_{0}/{1}/{2}'.format(instance.id, instance.created_at.strftime('%Y/%m/%d'), filename)

class Formation(models.Model):
    layer = models.ForeignKey(Layer, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to=formation_directory_path, null=True, blank=True)
    voice = models.ForeignKey(Voice, on_delete=models.CASCADE)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    trigger = models.CharField(max_length=255)
    last_update_date = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return self.name