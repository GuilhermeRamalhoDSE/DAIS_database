from django.contrib import admin
from django import forms
from dais.models.timeslot_models import TimeSlot
from dais.models.periodds_models import PeriodDS

class TimeSlotAdminForm(forms.ModelForm):
    class Meta:
        model = TimeSlot
        fields = '__all__'

@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    form = TimeSlotAdminForm
    list_display = ['id', 'period', 'start_time', 'end_time']
    list_filter = ['period__group__name', 'start_time', 'end_time']  
    search_fields = ['period__group__name', 'start_time', 'end_time']

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "period":
            if not request.user.is_superuser:
                group_ids = request.user.groups.values_list('id', flat=True)
                kwargs["queryset"] = PeriodDS.objects.filter(group__id__in=group_ids)
            else:
                kwargs["queryset"] = PeriodDS.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
