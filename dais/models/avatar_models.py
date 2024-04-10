from django.db import models
from django.utils.translation import gettext_lazy as _
from dais.models.license_models import License
from django.utils.timezone import now

def avatar_directory_path(instance, filename):
    date = instance.last_update_date or now()
    return 'avatar/license_{0}/{1}/{2}'.format(instance.license_id, date.strftime('%Y/%m/%d'), filename)

class Avatar(models.Model):
    license = models.ForeignKey(License, on_delete=models.CASCADE, verbose_name=_("ID Licenza"))
    name = models.CharField(max_length=255, verbose_name=_("Nome"))
    file = models.FileField(upload_to=avatar_directory_path, verbose_name=_("File"))
    voice = models.CharField(max_length=255, verbose_name=_("Voce"))
    last_update_date = models.DateTimeField(auto_now=True, verbose_name=_("Data ultimo aggiornamento"))
    

    class Meta:
        verbose_name = _("Avatar")
        verbose_name_plural = _("Avatar")

    def __str__(self):
        return self.name
