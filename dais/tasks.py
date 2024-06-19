from celery import shared_task
from django.utils import timezone
from dais.models.license_models import License
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

@shared_task
def deactivate_expired_licenses():
    logger.info("Starting to deactivate expired licenses.")
    today = timezone.now().date()
    expired_licenses = License.objects.filter(end_date__lt=today, active=True)
    count = expired_licenses.count()
    logger.info(f"Found {count} expired licenses to deactivate.")
    expired_licenses.update(active=False)
