from django.apps import AppConfig


class DaisConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'dais'

    def ready(self):
        import dais.signals
