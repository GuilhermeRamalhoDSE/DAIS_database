from django.contrib import admin
from dais.models.touchscreen_interactions_models import TouchScreenInteractions

class TouchScreenInteractionsAdmin(admin.ModelAdmin):
    list_display = ('id', 'client_module_id', 'name', 'total_buttons', 'last_update')
    search_fields = ('id','name')
    list_filter = ('id','name')
    ordering = ('id',)
    fields = ('id', 'client_module', 'name', 'total_buttons', 'last_update')
    readonly_fields = ('last_update',)

    def total_buttons(self, obj):
        return obj.total_buttons
    total_buttons.short_description = "Button"

admin.site.register(TouchScreenInteractions, TouchScreenInteractionsAdmin)