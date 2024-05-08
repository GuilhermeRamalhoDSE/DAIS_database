from django.contrib import admin
from dais.models.totem_models import Totem

class TotemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'group', 'installation_date', 'active', 'screen_count', 'last_update')
    list_filter = ('active', 'installation_date', 'group', 'last_update')
    search_fields = ("name", 'group__name')
    date_hierarchy = 'installation_date'
    ordering = ('installation_date',)
    readonly_fields = ('screen_count',) 
    fields = ('name', 'group', 'installation_date', 'active', 'comments', 'screen_count', 'last_update')

    def screen_count(self, obj):
        return obj.screen_count
    screen_count.short_description = "Screen"  

admin.site.register(Totem, TotemAdmin)
