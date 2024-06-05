from django.contrib import admin
from dais.models.screen_models import Screen

class ScreenAdmin(admin.ModelAdmin):
    list_display = ('id', 'totem_name', 'typology')
    list_filter = ('typology', 'totem__name')
    search_fields = ('typology', 'totem__name')
    raw_id_fields = ('totem',)
    date_hierarchy = 'created_at'
    ordering = ('created_at',)

    fieldsets = (
        (None, {
            'fields': ('totem_name', 'typology')
        }),
    )

admin.site.register(Screen, ScreenAdmin)