from django.contrib import admin
from django import forms
from dais.models.group_models import Group
from dais.models.client_models import Client

class GroupAdminForm(forms.ModelForm):
    class Meta:
        model = Group
        fields = '__all__'

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    form = GroupAdminForm
    list_display = ('id', 'name', 'client', 'typology', 'total_totems','last_update')
    search_fields = ('name', 'client__name', 'last_update', 'comments')
    list_filter = ('client', 'typology')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(client__license=request.user.license)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "client" and not request.user.is_superuser:
            kwargs["queryset"] = Client.objects.filter(license=request.user.license)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if not request.user.is_superuser and not change:
            if not obj.client:
                obj.client = Client.objects.filter(license=request.user.license).first()
        super().save_model(request, obj, form, change)

