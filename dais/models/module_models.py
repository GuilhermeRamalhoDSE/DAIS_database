from django.db import models
from django.utils.translation import gettext_lazy as _
from django.template.defaultfilters import slugify

class Module(models.Model):
    name = models.CharField(max_length=255, verbose_name=_("Nome"))
    slug = models.SlugField(max_length=255, unique=True, null=True, verbose_name=_('Slug'))
                            
    class Meta:
        verbose_name = _('Modulo')
        verbose_name_plural = _('Moduli')

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super(Module, self).save(*args, **kwargs)
        