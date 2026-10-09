from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self):
        # Register signal handlers (auto-create a Profile for every user).
        from . import signals  # noqa: F401
