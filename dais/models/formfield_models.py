from django.db import models
from dais.models.form_models import Form

class FormField(models.Model):
    FIELD_TYPES = [
        ('Text', 'Text'),
        ('Number', 'Number'),
        ('Date', 'Date')
    ]
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name='fields')
    name = models.CharField(max_length=255)
    number = models.IntegerField()
    field_type = models.CharField(max_length=50, choices=FIELD_TYPES, default='text')
    required = models.BooleanField(default=False)

    def __self__(self):
        return f'{self.number} - {self.name}' 