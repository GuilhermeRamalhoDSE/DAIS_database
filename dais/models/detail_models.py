from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.timezone import now

def detail_directory_path(instance, filename):
    return f'details/contribution_{instance.contribution_id}/{instance.created_at.strftime("%Y/%m/%d")}/{filename}'

class Detail(models.Model):
    contribution = models.ForeignKey('Contribution', on_delete=models.CASCADE)
    name = models.CharField(max_length=255, verbose_name=_("Nome"), blank=True)
    file = models.FileField(upload_to=detail_directory_path)
    created_at = models.DateTimeField(verbose_name=_("data di creazione"), default=now, blank=True)

    class Meta:
        verbose_name = _("Dettaglio")
        verbose_name_plural = _("Dettagli")

    def __str__(self):
        return f"Detail {self.id} for Contribution {self.contribution_id}"
