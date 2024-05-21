from django.contrib import admin
from dais.models.license_models import License


@admin.register(License)
class LicenseAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'email', 'address', 'tel', 'license_code', 'active',
        'start_date', 'end_date', 'list_avatars', 'list_voices', 'list_languages', 'list_modules', 'list_screentypes', 'list_buttontypes'  
    )
    list_filter = ('active', 'start_date', 'end_date')
    search_fields = ('name', 'email', 'license_code', 'avatars__name', 'voices__name', 'languages__name', 'modules__name', 'screentypes__name', 'buttontypes__name') 
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

    def list_modules(self, obj):
        return ", ".join([module.name for module in obj.modules.all()])
    list_modules.short_description = "Modules"

    def list_screentypes(self, obj):
        return ", ".join([screentype.name for screentype in obj.screentypes.all()])
    list_screentypes.short_description = "Screen Types"

    def list_buttontypes(self, obj):
        return ", ".join([buttontype.name for buttontype in obj.buttontypes.all()])
    list_buttontypes.short_description = "Button Types"
