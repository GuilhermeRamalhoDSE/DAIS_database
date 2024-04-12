from django.contrib import admin
from dais.models.totem_models import Totem

class TotemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'group', 'installation_date', 'active', 'screens')
    list_filter = ('active', 'installation_date', 'group')
    search_fields = ("name",'group__name')
    date_hierarchy = 'installation_date'
    ordering = ('installation_date',)
    fields = ('name', 'group', 'installation_date', 'active', 'screens', 'comments')

admin.site.register(Totem, TotemAdmin)
