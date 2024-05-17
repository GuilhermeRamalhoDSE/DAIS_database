from django.contrib import admin
from dais.models.buttontype_models import ButtonType

class ButtonTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

admin.site.register(ButtonType, ButtonTypeAdmin)