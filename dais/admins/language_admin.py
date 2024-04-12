from django.contrib import admin
from dais.models.language_models import Language  

class LanguageAdmin(admin.ModelAdmin):
    list_display = ('id', 'name') 
    search_fields = ('name',) 

admin.site.register(Language, LanguageAdmin)
