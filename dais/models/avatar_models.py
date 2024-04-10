from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now

def avatar_directory_path(instance, filename):
    date = instance.last_update_date or now()
    return 'avatar/{0}/{1}'.format(date.strftime('%Y/%m/%d'), filename)

class Avatar(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Nome"))
    file = models.FileField(upload_to=avatar_directory_path, verbose_name=_("File"))
    voice = models.CharField(max_length=255, verbose_name=_("Voce"))
    last_update_date = models.DateTimeField(auto_now=True, verbose_name=_("Data ultimo aggiornamento"))

    class Meta:
        verbose_name = _("Avatar")
        verbose_name_plural = _("Avatar")

    def __str__(self):
        return self.name
