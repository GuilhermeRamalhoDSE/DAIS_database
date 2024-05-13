from django.db import models
from django.utils.translation import gettext_lazy as _
from dais.models.layer_models import Layer
from dais.models.voice_models import Voice
from dais.models.language_models import Language
from django.utils.timezone import now

def formation_directory_path(instance, filename):
    return 'formation_{0}/{1}/{2}'.format(instance.id, instance.created_at.strftime('%Y/%m/%d'), filename)

class Formation(models.Model):
    layer = models.ForeignKey(Layer, on_delete=models.CASCADE, verbose_name=_('Layer ID'))
    name = models.CharField(max_length=255, verbose_name=_("Nome"))
    file = models.FileField(upload_to=formation_directory_path, verbose_name=_("File"), null=True, blank=True)
    voice = models.ForeignKey(Voice, on_delete=models.CASCADE, verbose_name=_("Voce ID"))
    language = models.ForeignKey(Language, on_delete=models.CASCADE, verbose_name=_("Lingua ID"))
    trigger = models.CharField(max_length=255, verbose_name=_("Trigger"))
    last_update_date = models.DateTimeField(auto_now=True, verbose_name=_("Data Dell'ultimo aggiornamento"))
    created_at = models.DateTimeField(default=now, verbose_name=_("Data di creazione"))

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = _("Formazione")
        verbose_name_plural = _("Formazioni")
