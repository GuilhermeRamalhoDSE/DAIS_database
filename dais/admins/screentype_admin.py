from django.contrib import admin
from dais.models.screentype_models import ScreenType

class ScreenTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

admin.site.register(ScreenType, ScreenTypeAdmin)