from django.core.mail import send_mail
from ninja import Router
from dais.models.password_reset_models import PasswordResetToken
from dais.models.user_models import User
from dais.schemas.reset_password_schema import ResetPasswordData

password_router = Router(tags=["Password"])

@password_router.post('/request-password-reset/')
def request_password_reset(request, email: str):
    user = User.objects.filter(email=email).first()
    if user:
        token = PasswordResetToken.objects.create(user=user)
        reset_link = f"https://prototypingdse.it/#/reset-password/{token.token}"
        send_mail(
            'Password Reset',
            f'Use the link to reset your password: {reset_link}',
            'diessee@gmail.com',
            [email],
            fail_silently=False,
        )
    return {"message": "If a user with this email exists, a password reset link has been sent."}

@password_router.post('/reset-password/{token}/')
def reset_password(request, token: str, data: ResetPasswordData):
    try:
        reset_token = PasswordResetToken.objects.get(token=token, user__is_active=True)
        if not reset_token.is_token_expired():  
            user = reset_token.user
            user.set_password(data.new_password)
            user.save()
            reset_token.delete()
            return {"message": "Password successfully reset."}
        else:
            return {"message": "Invalid or expired token."}, 400  
    except PasswordResetToken.DoesNotExist:
        return {"message": "Invalid or expired token."}, 404 


