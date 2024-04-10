from django.contrib import admin
from dais.models.client_models import Client
from dais.models.license_models import License

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'address', 'phone', 'active')  
    search_fields = ('name', 'email')
    list_filter = ('name', 'email', 'active')  

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(license=request.user.license)

    def save_model(self, request, obj, form, change):
        if not request.user.is_superuser:
            obj.license = request.user.license
        super().save_model(request, obj, form, change)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "license" and not request.user.is_superuser:
            kwargs["queryset"] = License.objects.filter(id=request.user.license.id)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
