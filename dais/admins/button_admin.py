from django.contrib import admin
from dais.models.button_models import Button

class ButtonAdmin(admin.ModelAdmin):
    list_display = ('name', 'interaction', 'button_type', 'created_at')
    list_filter = ('button_type', 'created_at')
    search_fields = ('name', 'interaction__name')
    readonly_fields = ('created_at',)

admin.site.register(Button, ButtonAdmin)
