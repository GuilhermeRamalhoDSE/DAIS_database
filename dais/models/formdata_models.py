from django.db import models
from dais.models.form_models import Form

class FormData(models.Model):
    form =  models.ForeignKey(Form, on_delete=models.CASCADE)
    data = models.JSONField()

    def __str__(self):
        return f'{self.form.name} - {self.id}'
    