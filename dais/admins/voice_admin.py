from django.contrib import admin
from dais.models.voice_models import Voice  

class VoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')  
    search_fields = ('name',)  

admin.site.register(Voice, VoiceAdmin)
