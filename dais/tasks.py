from celery import shared_task
from django.utils import timezone
from dais.models.license_models import License
from dais.models.campaignai_models import CampaignAI
from dais.models.campaignds_models import CampaignDS
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)

@shared_task
def deactivate_expired_licenses():
    logger.info("Starting to deactivate expired licenses.")
    today = timezone.now().date()
    expired_licenses = License.objects.filter(end_date__lt=today, active=True)
    count = expired_licenses.count()
    logger.info(f"Found {count} expired licenses to deactivate.")
    if count > 0:
        for license in expired_licenses:
            logger.info(f"Deactivating license: {license.name}, end date: {license.end_date}")
            license.active = False
            license.save()
            logger.info(f"Deactivated license: {license.name}")
    else:
        logger.info("No expired licenses found.")

@shared_task
def deactivate_expired_campaigns_ai():
    logger.info("Starting to deactivate expired CampaignAI.")
    today = timezone.now().date()
    expired_campaigns = CampaignAI.objects.filter(end_date__lt=today, active=True)
    count = expired_campaigns.count()
    logger.info(f"Found {count} expired CampaignAI to deactivate.")
    if count > 0:
        for campaign in expired_campaigns:
            logger.info(f"Deactivating campaign: {campaign.name}, end date: {campaign.end_date}")
            campaign.active = False
            campaign.save()
            logger.info(f"Deactivated campaign: {campaign.name}")
    else:
        logger.info("No expired CampaignAI found.")

@shared_task
def deactivate_expired_campaigns_ds():
    logger.info("Starting to deactivate expired CampaignDS.")
    today = timezone.now().date()
    expired_campaigns = CampaignDS.objects.filter(end_date__lt=today, active=True)
    count = expired_campaigns.count()
    logger.info(f"Found {count} expired CampaignDS to deactivate.")
    if count > 0:
        for campaign in expired_campaigns:
            logger.info(f"Deactivating campaign: {campaign.name}, end date: {campaign.end_date}")
            campaign.active = False
            campaign.save()
            logger.info(f"Deactivated campaign: {campaign.name}")
    else:
        logger.info("No expired CampaignDS found.")