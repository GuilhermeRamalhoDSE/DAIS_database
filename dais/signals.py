from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils.timezone import now
from dais.models.totem_models import Totem
from dais.models.screen_models import Screen

@receiver(post_save, sender=Screen)
@receiver(post_delete, sender=Screen)
def update_totem_last_update(sender, instance, **kwargs):
    current_time = now()
    if hasattr(instance, 'totem'):
        Totem.objects.filter(pk=instance.totem.pk).update(last_update=current_time)