from django.contrib import admin
from dais.models.screen_models import Screen

class ScreenAdmin(admin.ModelAdmin):
    list_display = ('id', 'totem', 'typology', 'created_at')
    list_filter = ('typology', 'created_at')
    search_fields = ('typology', 'totem__name')
    raw_id_fields = ('totem',)
    date_hierarchy = 'created_at'
    ordering = ('created_at',)

    fieldsets = (
        (None, {
            'fields': ('totem', 'typology', 'logo', 'background', 'footer', 'created_at')
        }),
    )

admin.site.register(Screen, ScreenAdmin)
