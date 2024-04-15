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
    list_display = ('id', 'totem', 'date', 'typology', 'information')
    list_filter = ('totem__group__client', 'date', 'typology')
    search_fields = ('totem__name', 'information', 'typology')
    date_hierarchy = 'date'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(totem__group__client__license=request.user.license)

