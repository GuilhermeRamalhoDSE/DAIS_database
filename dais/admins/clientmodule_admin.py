from django.contrib import admin
from dais.models.clientmodule_models import ClientModule

class ClientModuleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'form_count')
    list_filter = ('id', 'name')
    search_fields = ('id', 'name')
    ordering = ('id',)
    readonly_fields = ('form_count',)
    fields = ('id', 'name', 'form_count')

    def form_count(self, obj):
        return obj.form_count
    form_count.short_description = "Form"
admin.site.register(ClientModule, ClientModuleAdmin)