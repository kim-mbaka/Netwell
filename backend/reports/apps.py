from django.apps import AppConfig


class ReportsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "reports"

    def ready(self):
        # Register signal handlers (stock deduction on report submit).
        from . import signals  # noqa: F401
