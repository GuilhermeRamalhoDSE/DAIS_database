from django.contrib import admin
from dais.models.campaignds_models import CampaignDS  

@admin.register(CampaignDS)
class CampaignDSAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'group', 'start_date', 'end_date', 'last_update', 'active', 'duration', 'logo', 'background', 'footer', 'created_at'
    )
    list_filter = ('name', 'group', 'start_date', 'end_date', 'active')  
    search_fields = ('name', 'start_date', 'end_date')  
    ordering = ('-start_date',)

    def has_view_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_add_permission(self, request):
        return request.user.is_superuser

    def duration(self, obj):
        return (obj.end_date - obj.start_date).days
    duration.short_description = "Duration (days)"
