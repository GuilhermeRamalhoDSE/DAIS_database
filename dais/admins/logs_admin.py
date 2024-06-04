from django.contrib import admin
from django import forms
from dais.models.logs_models import Log

class LogAdminForm(forms.ModelForm):
    class Meta:
        model = Log
        fields = '__all__'

@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    form = LogAdminForm
    list_display = ('id', 'totem', 'license', 'client', 'campaign', 'date', 'typology', 'logtype', 'information')
    list_filter = ('date', 'typology', 'client', 'campaign','logtype')
    search_fields = ('information', 'typology')
    date_hierarchy = 'date'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(license=request.user.license)
