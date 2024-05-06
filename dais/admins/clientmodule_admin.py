from django.contrib import admin
from dais.models.clientmodule_models import ClientModule

class ClientModuleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'module', 'form_count')
    list_filter = ('id', 'name', 'module')
    search_fields = ('name', 'module')
    ordering = ('id',)
    readonly_fields = ('id', 'form_count',)

    def form_count(self, obj):
        return obj.form_count
    form_count.short_description = "Form"
admin.site.register(ClientModule, ClientModuleAdmin)