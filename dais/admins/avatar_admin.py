from django.contrib import admin
from dais.models.avatar_models import Avatar
from dais.models.license_models import License

@admin.register(Avatar)
class AvatarAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'voice', 'last_update_date', 'file', 'license')
    search_fields = ('name', 'voice')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(license=request.user.license)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "license" and not request.user.is_superuser:
            kwargs["queryset"] = License.objects.filter(id=request.user.license.id)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
