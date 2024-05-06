from django.contrib import admin
from dais.models.module_models import Module

class ModuleAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

admin.site.register(Module, ModuleAdmin)
