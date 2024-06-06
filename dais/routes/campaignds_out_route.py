from ninja import Router
from dais.models.campaignds_models import CampaignDS
from dais.models.timeslot_models import TimeSlot
from dais.models.contributionds_models import ContributionDS

campaigndsout_router = Router()

@campaigndsout_router.get("/{group_id}", response=dict)
def get_overview(request, group_id: int):
    campaigns = CampaignDS.objects.filter(group_id=group_id, active=True)
    campaign_data = []
    for campaign in campaigns:
        time_slots = TimeSlot.objects.filter(campaign_id=campaign.id)
        time_slot_data = []
        for time_slot in time_slots:
            contributions = ContributionDS.objects.filter(time_slot_id=time_slot.id)
            contribution_data = []
            for contribution in contributions:
                contribution_data.append({
                    "name": contribution.name,
                    "file_url": contribution.file.url,  
                    "created_at": contribution.created_at.strftime('%d-%m-%Y %H:%M:%S'),
                })
            time_slot_data.append({
                "start_time": time_slot.start_time.strftime('%H:%M'),
                "end_time": time_slot.end_time.strftime('%H:%M'),
                "is_random": time_slot.is_random,
                "contributions": contribution_data
            })
        campaign_data.append({
            "name": campaign.name,
            "start_date": campaign.start_date.strftime('%d-%m-%Y'),
            "end_date": campaign.end_date.strftime('%d-%m-%Y'),
            "last_update": campaign.last_update.strftime('%d-%m-%Y %H:%M:%S'),
            "time_slots": time_slot_data
        })
    return {"campaigns": campaign_data}
