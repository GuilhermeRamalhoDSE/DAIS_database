from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils.timezone import now

from dais.models.group_models import Group
from dais.models.periodds_models import PeriodDS
from dais.models.timeslot_models import TimeSlot
from dais.models.contribution_models import Contribution
from dais.models.detail_models import Detail

@receiver(post_save, sender=Group)
@receiver(post_save, sender=PeriodDS)
@receiver(post_save, sender=TimeSlot)
@receiver(post_save, sender=Contribution)
@receiver(post_save, sender=Detail)
@receiver(post_delete, sender=PeriodDS)
@receiver(post_delete, sender=TimeSlot)
@receiver(post_delete, sender=Contribution)
@receiver(post_delete, sender=Detail)
def update_group_last_update(sender, instance, **kwargs):
    current_time = now()
    if sender == Group:
        if instance.last_update != current_time:
            instance.last_update = current_time
            instance.save(update_fields=['last_update'])
    else:
        group_instance = instance.group if sender == PeriodDS else \
                         instance.period.group if sender in [TimeSlot, Contribution] else \
                         instance.contribution.time_slot.period.group
        if group_instance.last_update != current_time:
            group_instance.last_update = current_time
            group_instance.save(update_fields=['last_update'])
