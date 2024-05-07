from django.contrib import admin
from dais.models.formdata_models import FormData

class FormDataAdmin(admin.ModelAdmin):
    list_display = ['form', 'data']
    list_filter = ['form']
    search_fields = ['form__name']
    
admin.site.register(FormData, FormDataAdmin)