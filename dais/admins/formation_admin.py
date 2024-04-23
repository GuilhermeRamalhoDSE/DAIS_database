from django.contrib import admin
from dais.models.formation_models import Formation

class FormationAdmin(admin.ModelAdmin):
    list_display = ('id', 'layer', 'name', 'file', 'voice', 'language', 'trigger', 'last_update_date')
    list_filter = ('name', 'layer', 'voice', 'language')
    search_fields = ('name', 'layer', 'voice', 'language')
    date_hierarchy = 'created_at'
    ordering = ('id',)
    fields = ('id', 'name', 'layer', 'file', 'voice', 'language', 'trigger', 'last_update_date', 'created_at')
    readonly_fields = ('created_at',)

admin.site.register(Formation, FormationAdmin)