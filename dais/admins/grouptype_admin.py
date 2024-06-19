from django.contrib import admin
from dais.models.grouptype_models import GroupType

class GroupTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

admin.site.register(GroupType, GroupTypeAdmin)