from django.db import models
import uuid
from django.utils import timezone
from dais.models.user_models import User

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_token_expired(self):
        return (timezone.now() - self.created_at).days > 1
