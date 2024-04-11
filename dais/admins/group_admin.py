from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from dais.models.group_models import Group
from dais.models.license_models import License

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'license', 'name', 'typology', 'total_totems', 'display_comments')
    search_fields = ('name', 'comments')  
    list_filter = ('license', 'typology') 

    def display_comments(self, obj):
        """Uma função para abreviar comentários longos na visualização da lista."""
        return (obj.comments[:75] + '...') if obj.comments else ''
    display_comments.short_description = _("Commenti")

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(license=request.user.license.id)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "license" and not request.user.is_superuser:
            kwargs["queryset"] = License.objects.filter(id=request.user.license.id)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def save_model(self, request, obj, form, change):
        if not request.user.is_superuser and not change:
            obj.license = request.user.license
        super().save_model(request, obj, form, change)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser:
            pass
        return form
