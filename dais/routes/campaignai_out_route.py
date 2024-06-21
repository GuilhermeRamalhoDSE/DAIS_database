from ninja import Router
from typing import List
from dais.models.campaignai_models import CampaignAI
from dais.models.layer_models import Layer
from dais.models.contributionai_models import ContributionAI
from dais.models.formation_models import Formation
from dais.schemas.contributionai_schema import ContributionAISchema
from dais.schemas.formation_schema import FormationSchema
from dais.schemas.layer_schema import LayerOut  

campaigniaout_router = Router()

@campaigniaout_router.get("/{group_id}", response=List[dict])
def get_ia_overview(request, group_id: int):
    campaigns = CampaignAI.objects.filter(group=group_id, active=True)
    campaign_data = []
    for campaign in campaigns:
        layers = Layer.objects.filter(campaignai=campaign).prefetch_related('children', 'avatar')
        layer_data = []
        for layer in layers:
            contributions = ContributionAI.objects.filter(layer=layer).select_related('language')
            contribution_data = [ContributionAISchema.from_orm(contribution).dict() for contribution in contributions]

            formations = Formation.objects.filter(layer=layer).select_related('voice', 'language')
            formation_data = [FormationSchema.from_orm(formation).dict() for formation in formations]

            layer_serialized = LayerOut.from_orm(layer).dict()
            layer_serialized.update({
                "contributions": contribution_data,
                "formations": formation_data,
            })
            layer_data.append(layer_serialized)


        campaign_data.append({
            "name": campaign.name,
            "start_date": campaign.start_date.strftime('%d-%m-%Y'),
            "end_date": campaign.end_date.strftime('%d-%m-%Y'),
            "logo_path": campaign.logo.url if campaign.logo else None,
            "background_path": campaign.background.url if campaign.background else None,
            "footer": campaign.footer,
            "last_update": campaign.last_update.strftime('%d-%m-%Y %H:%M:%S'),
            "layers": layer_data
        })

    return campaign_data
