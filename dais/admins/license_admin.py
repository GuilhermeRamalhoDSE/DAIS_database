from django.contrib import admin
from dais.models.license_models import License
from django.utils.html import format_html

@admin.register(License)
class LicenseAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'email', 'address', 'tel', 'license_code', 'active',
        'start_date', 'end_date', 'list_avatars'
    )
    list_filter = ('active', 'start_date', 'end_date')
    search_fields = ('name', 'email', 'license_code', 'avatars__name')
    ordering = ('-start_date',)

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_add_permission(self, request):
        return request.user.is_superuser

    def list_avatars(self, obj):
        """
        This method creates a comma-separated list of avatars linked to the license.
        If needed, it can be adjusted to link directly to the avatar change pages.
        """
        return ", ".join([avatar.name for avatar in obj.avatars.all()])
    list_avatars.short_description = "Avatares"
