from django.contrib import admin
from dais.models.screen_models import Screen

class ScreenAdmin(admin.ModelAdmin):
    list_display = ('id', 'typology', 'totem') 
    list_filter = ('typology', 'totem__name')
    search_fields = ('typology', 'totem__name')
    raw_id_fields = ('totem',)


    fieldsets = (
        (None, {
            'fields': ('totem', 'typology')  
        }),
    )

admin.site.register(Screen, ScreenAdmin)