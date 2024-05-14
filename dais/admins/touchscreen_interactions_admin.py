from django.contrib import admin
from dais.models.touchscreen_interactions_models import TouchScreenInteractions

class TouchScreenInteractionsAdmin(admin.ModelAdmin):
    list_display = ('id', 'clientmodule_id', 'name', 'total_button', 'last_update')
    search_fields = ('name',)
    list_filter = ('name', 'id', 'last_update')

    def total_buttons(self, obj):
        return obj.total_buttons
    total_buttons.short_description = "Button"

admin.site.register(TouchScreenInteractions, TouchScreenInteractionsAdmin)