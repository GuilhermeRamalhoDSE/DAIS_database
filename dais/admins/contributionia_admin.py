from django.contrib import admin
from dais.models.contributionia_models import ContributionIA

class ContributionIAAdmin(admin.ModelAdmin):
    list_display = ('id', 'layer' ,'name', 'file', 'language', 'type', 'trigger', 'detail', 'last_update_date')
    list_filter = ('type', 'language', 'name')
    search_fields = ('name', 'type', 'language')
    date_hierarchy = 'created_at'
    ordering = ('id',)
    fields = ('layer', 'name', 'file', 'language', 'type', 'trigger', 'last_update_date', 'detail', 'created_at')
    readonly_fields = ('created_at',)

admin.site.register(ContributionIA, ContributionIAAdmin)
