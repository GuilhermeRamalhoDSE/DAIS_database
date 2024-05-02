from ninja import Router
from dais.models.periodds_models import PeriodDS
from dais.models.timeslot_models import TimeSlot
from dais.models.contribution_models import Contribution
from dais.models.detail_models import Detail
from dais.schemas.detail_schema import DetailSchema

perioddsout_router = Router()

@perioddsout_router.get("/{group_id}", response=dict)
def get_overview(request, group_id: int):
    periods = PeriodDS.objects.filter(group_id=group_id, active=True)
    period_data = []
    for period in periods:
        time_slots = TimeSlot.objects.filter(period_id=period.id)
        time_slot_data = []
        for time_slot in time_slots:
            contributions = Contribution.objects.filter(time_slot_id=time_slot.id)
            contribution_data = []
            for contribution in contributions:
                details = Detail.objects.filter(contribution_id=contribution.id)
                detail_data = [DetailSchema.from_orm(detail).dict() for detail in details]
                contribution_data.append({
                    "is_random": contribution.is_random,  
                    "details": detail_data
                })
            time_slot_data.append({
                "start": time_slot.start_time.strftime('%H:%M'),
                "end": time_slot.end_time.strftime('%H:%M'),
                "contributions": contribution_data
            })
        period_data.append({
            "start": period.start_date.strftime('%d-%m-%Y'),
            "end": period.end_date.strftime('%d-%m-%Y'),
            "last_updated": period.last_update.strftime('%d-%m-%Y'),
            "time_slots": time_slot_data
        })
    return {"periods": period_data}
