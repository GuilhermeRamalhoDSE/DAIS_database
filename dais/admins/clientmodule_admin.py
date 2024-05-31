from django.contrib import admin
from dais.models.clientmodule_models import ClientModule

class ClientModuleAdmin(admin.ModelAdmin):
    list_display = ('id', 'module', 'form_count', 'list_groups')
    list_filter = ('id', 'module')
    search_fields = ('module', 'groups__name')
    ordering = ('id',)
    readonly_fields = ('id', 'form_count',)

    def form_count(self, obj):
        return obj.form_count
    form_count.short_description = "Form"

    def list_groups(self, obj):
        return ", ".join([group.name for group in obj.groups.all()])
    list_groups.short_description = "Groups"

admin.site.register(ClientModule, ClientModuleAdmin)