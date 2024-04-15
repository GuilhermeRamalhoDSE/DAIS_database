from django.contrib import admin
from dais.models.periodia_models import PeriodIA 

@admin.register(PeriodIA)
class PeriodIAAdmin(admin.ModelAdmin):
    list_display = (
        'group', 'start_date', 'end_date', 'last_update', 'active', 'duration'
    )
    list_filter = ('group', 'start_date', 'end_date', 'active')  
    search_fields = ('group__name', 'start_date', 'end_date')  
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
