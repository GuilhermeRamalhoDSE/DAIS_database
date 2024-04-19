from django.contrib import admin
from dais.models.totem_models import Totem

class TotemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'group', 'installation_date', 'active', 'screens_count')
    list_filter = ('active', 'installation_date', 'group')
    search_fields = ("name", 'group__name')
    date_hierarchy = 'installation_date'
    ordering = ('installation_date',)
    readonly_fields = ('screens_count',) 
    fields = ('name', 'group', 'installation_date', 'active', 'comments', 'screens_count')

    def screens_count(self, obj):
        return obj.screens_count()
    screens_count.short_description = "Screens"  

admin.site.register(Totem, TotemAdmin)
