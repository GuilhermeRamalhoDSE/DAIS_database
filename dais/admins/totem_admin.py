from django.contrib import admin
from dais.models.totem_models import Totem

class TotemAdmin(admin.ModelAdmin):
    list_display = ('id', 'license', 'client', 'group', 'installation_date', 'active', 'screens')
    list_filter = ('active', 'installation_date', 'group')
    search_fields = ('group__name', 'client__name', 'license__name')
    date_hierarchy = 'installation_date'
    ordering = ('installation_date',)
    fields = ('license', 'client', 'group', 'installation_date', 'active', 'screens', 'comments')

admin.site.register(Totem, TotemAdmin)
