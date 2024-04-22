from django.contrib import admin
from dais.models.contributionia_models import ContributionIA

class ContributionIAAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'language', 'last_update_date', 'created_at')
    list_filter = ('type', 'language', 'last_update_date', 'created_at')
    search_fields = ('name', 'detail')
    date_hierarchy = 'created_at'
    ordering = ('id',)
    fields = ('layer', 'name', 'file', 'language', 'type', 'trigger', 'last_update_date', 'detail', 'created_at')
    readonly_fields = ('created_at',)

    def save_model(self, request, obj, form, change):
        if not obj.pk:  
            pass
        super().save_model(request, obj, form, change)

admin.site.register(ContributionIA, ContributionIAAdmin)
