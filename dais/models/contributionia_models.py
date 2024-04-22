from django.db import models
from django.utils.translation import gettext_lazy as _
from dais.models.language_models import Language
from dais.models.layer_models import Layer
from django.utils.timezone import now

def contribuitionia_directory_path(instance, filename):
    return 'contributionIA_{0}/{1}/{2}'.format(instance.id, instance.created_at.strftime('%Y/%m/%d'), filename)

class ContributionIA(models.Model):
    layer = models.ForeignKey(Layer, on_delete=models.CASCADE, verbose_name=_("id layer"))
    name = models.CharField(max_length=255, verbose_name=_("nome"))
    file = models.FileField(upload_to=contribuitionia_directory_path, verbose_name=_("file"), null=True, blank=True)
    language = models.ForeignKey(Language, on_delete=models.CASCADE, verbose_name=_("id lingua"))
    TYPE_CHOICES = [
        ('VIDEO', _('Video')),  
        ('IMAGE', _('Image')),  
        ('3D', _('3D')) 
    ]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, verbose_name=_("tipologia"))
    trigger = models.CharField(max_length=255, verbose_name=_("trigger"))
    last_update_date = models.DateTimeField(auto_now=True, verbose_name=_("data dell'ultima aggiornazione"), null=True, blank=True)
    detail = models.TextField(verbose_name=_("dettaglio"), null=True, blank=True)
    created_at = models.DateTimeField(default=now, verbose_name=_("Data di creazione"))

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _("Contribuiti IA")
        verbose_name_plural = _("Contributi IA")
