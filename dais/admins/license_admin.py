from django.contrib import admin
from dais.models.license_models import License


@admin.register(License)
class LicenseAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'email', 'address', 'tel', 'license_code', 'active',
        'start_date', 'end_date', 'list_avatars', 'list_voices', 'list_languages'  
    )
    list_filter = ('active', 'start_date', 'end_date')
    search_fields = ('name', 'email', 'license_code', 'avatars__name', 'voices__name', 'languages__name') 
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
        return ", ".join([avatar.name for avatar in obj.avatars.all()])
    list_avatars.short_description = "Avatars"

    def list_voices(self, obj):
        return ", ".join([voice.name for voice in obj.voices.all()])
    list_voices.short_description = "Voices"

    def list_languages(self, obj):
        return ", ".join([language.name for language in obj.languages.all()])
    list_languages.short_description = "Languages"
