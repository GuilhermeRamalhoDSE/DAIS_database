from django.contrib import admin
from dais.models.contribution_models import Contribution
from dais.models.timeslot_models import TimeSlot

@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    list_display = ('id', 'time_slot', 'detail_count', 'is_random')  
    search_fields = ('time_slot__id',)  
    list_filter = ('time_slot', 'is_random') 

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(time_slot__some_field=request.user.some_field)  

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "time_slot":
            if not request.user.is_superuser:
                kwargs["queryset"] = TimeSlot.objects.filter(some_field=request.user.some_field)  
            else:
                kwargs["queryset"] = TimeSlot.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
