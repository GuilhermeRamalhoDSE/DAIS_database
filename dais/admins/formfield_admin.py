from django.contrib import admin
from dais.models.formfield_models import FormField

class FormFieldInline(admin.StackedInline):
    model = FormField
    extra = 1  
    min_num = 1 
    ordering = ['number']

class FormFieldAdmin(admin.ModelAdmin):
    list_display = ['form', 'number', 'name', 'field_type', 'required']
    list_filter = ['form', 'field_type', 'required']
    search_fields = ['name']
    ordering = ['form', 'number']

admin.site.register(FormField, FormFieldAdmin)
