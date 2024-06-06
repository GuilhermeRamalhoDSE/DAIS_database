from django.db import models
from django.utils.timezone import now

def avatar_directory_path(instance, filename):
    date = instance.last_update_date or now()
    return 'avatar/{0}/{1}'.format(date.strftime('%Y/%m/%d'), filename)

class Avatar(models.Model):
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to=avatar_directory_path)
    last_update_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
