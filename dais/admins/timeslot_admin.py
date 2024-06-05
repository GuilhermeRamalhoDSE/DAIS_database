from django.contrib import admin
from django import forms
from dais.models.timeslot_models import TimeSlot
from dais.models.campaignds_models import CampaignDS

class TimeSlotAdminForm(forms.ModelForm):
    class Meta:
        model = TimeSlot
        fields = '__all__'

@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    form = TimeSlotAdminForm
    list_display = ['id', 'period', 'start_time', 'end_time', 'contributionds_count', 'is_random']
    list_filter = ['period__group__name', 'start_time', 'end_time']  
    search_fields = ['period__group__name', 'start_time', 'end_time']

    def total_contributionds(self, obj):
        return obj.total_contributionds
    total_contributionds.short_description = "ContributionDS"


