from django.contrib import admin
from dais.models.module_models import Module

class ModuleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

admin.site.register(Module, ModuleAdmin)
