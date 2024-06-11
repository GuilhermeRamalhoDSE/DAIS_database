from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils.timezone import now
from dais.models.totem_models import Totem
from dais.models.screen_models import Screen
from dais.models.group_models import Group
from dais.models.campaignds_models import CampaignDS
from dais.models.campaignai_models import CampaignAI
from dais.models.timeslot_models import TimeSlot
from dais.models.contributionds_models import ContributionDS
from dais.models.contributionai_models import ContributionAI
from dais.models.formation_models import Formation
from dais.models.layer_models import Layer

@receiver([post_save, post_delete], sender=Totem)
@receiver([post_save, post_delete], sender=CampaignDS)
@receiver([post_save, post_delete], sender=CampaignAI)
def update_group_needs_update_for_campaign_and_totem(sender, instance, **kwargs):
    try:
        group = instance.group
        group.needs_update = True
        group.save()
    except Group.DoesNotExist:
        pass

@receiver([post_save, post_delete], sender=Screen)
def update_group_needs_update_for_screen(sender, instance, **kwargs):
    try:
        group = instance.totem.group
        group.needs_update = True
        group.save()
    except (Totem.DoesNotExist, Group.DoesNotExist):
        pass

@receiver([post_save, post_delete], sender=TimeSlot)
def update_group_needs_update_for_timeslot(sender, instance, **kwargs):
    try:
        group = instance.campaignds.group
        group.needs_update = True
        group.save()
    except (CampaignDS.DoesNotExist, Group.DoesNotExist):
        pass

@receiver([post_save, post_delete], sender=ContributionDS)
def update_group_needs_update_for_contributionds(sender, instance, **kwargs):
    try:
        group = instance.time_slot.campaignds.group
        group.needs_update = True
        group.save()
    except (TimeSlot.DoesNotExist, CampaignDS.DoesNotExist, Group.DoesNotExist):
        pass

@receiver([post_save, post_delete], sender=Layer)
def update_group_needs_update_for_layers(sender, instance, **kwargs):
    try:
        group = instance.campaignai.group
        group.needs_update = True
        group.save()
    except (TimeSlot.DoesNotExist, CampaignDS.DoesNotExist, Group.DoesNotExist):
        pass

@receiver([post_save, post_delete], sender=Formation)
@receiver([post_save, post_delete], sender=ContributionAI)
def update_group_needs_update_for_contributionai_and_formation(sender, instance, **kwargs):
    try:
        group = instance.layer.campaignai.group
        group.needs_update = True
        group.save()
    except (TimeSlot.DoesNotExist, CampaignDS.DoesNotExist, Group.DoesNotExist):
        pass

@receiver(post_save, sender=Screen)
@receiver(post_delete, sender=Screen)
def update_totem_last_update(sender, instance, **kwargs):
    current_time = now()
    try:
        if instance.totem:
            Totem.objects.filter(pk=instance.totem.pk).update(last_update=current_time)
    except Totem.DoesNotExist:
        pass