from django.contrib import admin
from dais.models.contributionds_models import ContributionDS
from dais.models.timeslot_models import TimeSlot


class ContributionDSAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'time_slot', 'file', 'created_at')  
    list_filter = ('id', 'name') 
    search_fields = ('name', 'created_at') 
    date_hierarchy = 'created_at' 
    readonly_fields = ('created_at',)

admin.site.register(ContributionDS, ContributionDSAdmin)
