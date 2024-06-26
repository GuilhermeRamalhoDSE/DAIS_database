from django.contrib import admin
from dais.models.form_models import Form
from dais.admins.formfield_admin import FormFieldInline

class FormAdmin(admin.ModelAdmin):
    list_display = ('id', 'client_module', 'name', 'last_update')
    inlines = [FormFieldInline]
    list_filter = ('id', 'name')
    search_fields = ('id', 'name')
    ordering = ('id',)
    fields = ('id', 'client_module', 'name', 'last_update')
    readonly_fields = ('last_update',)
admin.site.register(Form, FormAdmin)