from django.db import models
from dais.models.touchscreen_interactions_models import TouchScreenInteractions
from dais.models.buttontype_models import ButtonType
from dais.models.form_models import Form
from django.utils.timezone import now

def button_directory_path(instance, filename):
    return 'button_{0}/{1}/{2}'.format(instance.id, instance.created_at.strftime('%Y/%m/%d'), filename)

class Button(models.Model):
    interaction = models.ForeignKey(TouchScreenInteractions, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    button_type = models.ForeignKey(ButtonType, on_delete=models.CASCADE)
    url = models.URLField(blank=True, null=True)
    form = models.ForeignKey(Form, on_delete=models.CASCADE, null=True, blank=True)
    file = models.FileField(upload_to=button_directory_path, null=True, blank=True)
    created_at = models.DateTimeField(default=now)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.button_type.name in ['Video', 'Slideshow'] and not self.file:
            raise ValueError("An file is required for video or slideshows.")
        if self.button_type.name == 'Web Page' and not self.url:
            raise ValueError("A URL is required for web page type.")
        if self.button_type.name == 'Form' and not self.form:
            raise ValueError("A form is necessary for the FORM type.")
        super().save(*args, **kwargs)
