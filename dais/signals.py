from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils.timezone import now
from dais.models.group_models import Group
from dais.models.periodds_models import PeriodDS
from dais.models.timeslot_models import TimeSlot
from dais.models.contribution_models import Contribution
from dais.models.detail_models import Detail
from dais.models.periodia_models import PeriodIA
from dais.models.layer_models import Layer
from dais.models.contributionia_models import ContributionIA
from dais.models.formation_models import Formation

@receiver(post_save, sender=Group)
@receiver(post_save, sender=PeriodDS)
@receiver(post_save, sender=TimeSlot)
@receiver(post_save, sender=Contribution)
@receiver(post_save, sender=Detail)
@receiver(post_save, sender=PeriodIA)
@receiver(post_save, sender=Layer)
@receiver(post_save, sender=ContributionIA)
@receiver(post_save, sender=Formation)
@receiver(post_delete, sender=PeriodDS)
@receiver(post_delete, sender=TimeSlot)
@receiver(post_delete, sender=Contribution)
@receiver(post_delete, sender=Detail)
@receiver(post_delete, sender=PeriodIA)
@receiver(post_delete, sender=Layer)
@receiver(post_delete, sender=ContributionIA)
@receiver(post_delete, sender=Formation)
def update_group_last_update(sender, instance, **kwargs):
    current_time = now()
    group_instance = None

    if sender == Group:
        Group.objects.filter(pk=instance.pk).update(last_update=current_time)
        return

    if isinstance(instance, (PeriodDS, PeriodIA)):
        group_instance = instance.group
    elif isinstance(instance, TimeSlot):
        group_instance = instance.period.group
    elif isinstance(instance, Contribution):
        group_instance = instance.time_slot.period.group
    elif isinstance(instance, Detail):
        group_instance = instance.contribution.time_slot.period.group
    elif isinstance(instance, Layer):
        group_instance = instance.period.group
    elif isinstance(instance, ContributionIA):
        group_instance = instance.layer.period.group
    elif isinstance(instance, Formation):
        group_instance = instance.contributionia.layer.period.group

    if group_instance:
        Group.objects.filter(pk=group_instance.pk).update(last_update=current_time)
