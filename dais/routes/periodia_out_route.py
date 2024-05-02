from ninja import Router
from dais.models.periodia_models import PeriodIA
from dais.models.layer_models import Layer
from dais.models.contributionia_models import ContributionIA
from dais.models.formation_models import Formation

periodiaout_router = Router()

@periodiaout_router.get("/{group_id}", response=dict)
def get_ia_overview(request, group_id: int):
    periods = PeriodIA.objects.filter(group=group_id, active=True)
    period_data = []
    for period in periods:
        layers = Layer.objects.filter(period=period)
        layer_data = []
        for layer in layers:
            contributions = ContributionIA.objects.filter(layer=layer)
            contribution_data = []
            for contribution in contributions:
                contribution_data.append({
                    "name": contribution.name,
                    "type": contribution.type,
                    "trigger": contribution.trigger,
                    "details": contribution.detail if contribution.detail else "No details",
                    "last_updated": contribution.last_update_date.strftime('%d-%m-%Y')
                })

            formations = Formation.objects.filter(layer=layer)
            formation_data = []
            for formation in formations:
                formation_data.append({
                    "name": formation.name,
                    "trigger": formation.trigger,
                    "voice": formation.voice.name,
                    "last_updated": formation.last_update_date.strftime('%d-%m-%Y')
                })

            layer_data.append({
                "name": layer.name,
                "number": layer.layer_number,
                "contributions": contribution_data,
                "formations": formation_data,
                "last_updated": layer.last_update_date.strftime('%d-%m-%Y')
            })

        period_data.append({
            "start": period.start_date.strftime('%d-%m-%Y'),
            "end": period.end_date.strftime('%d-%m-%Y'),
            "last_updated": period.last_update.strftime('%d-%m-%Y'),
            "layers": layer_data
        })

    return {"periods": period_data}
