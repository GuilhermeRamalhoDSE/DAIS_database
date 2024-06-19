from django.db import models
from dais.models.avatar_models import Avatar
from dais.models.voice_models import Voice
from dais.models.language_models import Language
from dais.models.module_models import Module
from dais.models.screentype_models import ScreenType
from dais.models.buttontype_models import ButtonType

class License(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    tel = models.CharField(max_length=20, null=True, blank=True)
    active = models.BooleanField(default=True)
    start_date = models.DateField()
    end_date = models.DateField()
    avatars = models.ManyToManyField(Avatar, blank=True)
    voices = models.ManyToManyField(Voice, blank=True)
    languages = models.ManyToManyField(Language, blank=True)
    modules = models.ManyToManyField(Module, blank=True)
    screentypes = models.ManyToManyField(ScreenType, blank=True)
    buttontypes = models.ManyToManyField(ButtonType, blank=True)
    total_totem = models.IntegerField(default=0)

    def __str__(self):
        return self.name
