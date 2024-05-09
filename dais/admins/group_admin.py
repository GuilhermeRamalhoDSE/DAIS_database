from django.contrib import admin
from dais.models.group_models import Group



class GroupAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'client', 'typology', 'total_totems','last_update', 'list_forms')
    search_fields = ('name', 'client__name', 'last_update', 'comments', 'forms__name')
    list_filter = ('client', 'typology')

    def total_totems(self, obj):
        return obj.total_totems
    total_totems.short_description = "Totem"

    def list_forms(self, obj):
        return ", ".join([form.name for form in obj.forms.all()])
    list_forms.short_description = "Forms"

admin.site.register(Group, GroupAdmin)

