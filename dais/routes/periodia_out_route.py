from ninja import Router
from typing import List
from dais.models.periodia_models import PeriodIA
from dais.models.layer_models import Layer
from dais.models.contributionia_models import ContributionIA
from dais.models.formation_models import Formation
from dais.schemas.contributionia_schema import ContributionIASchema
from dais.schemas.formation_schema import FormationSchema
from dais.schemas.layer_schema import LayerOut  

periodiaout_router = Router()

@periodiaout_router.get("/{group_id}", response=List[dict])
def get_ia_overview(request, group_id: int):
    periods = PeriodIA.objects.filter(group=group_id, active=True)
    period_data = []
    for period in periods:
        layers = Layer.objects.filter(period=period).prefetch_related('children', 'avatar')
        layer_data = []
        for layer in layers:
            contributions = ContributionIA.objects.filter(layer=layer).select_related('language', 'layer')
            contribution_data = [ContributionIASchema.from_orm(contribution).dict() for contribution in contributions]

            formations = Formation.objects.filter(layer=layer).select_related('voice', 'language', 'layer')
            formation_data = [FormationSchema.from_orm(formation).dict() for formation in formations]

            layer_serialized = LayerOut.from_orm(layer).dict()
            layer_serialized.update({
                "contributions": contribution_data,
                "formations": formation_data,
            })
            layer_data.append(layer_serialized)

        period_data.append({
            "id": period.id,
            "start": period.start_date.strftime('%d-%m-%Y'),
            "end": period.end_date.strftime('%d-%m-%Y'),
            "last_updated": period.last_update.strftime('%d-%m-%Y'),
            "layers": layer_data
        })

    return period_data
