from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Profile

User = get_user_model()


def _default_role(user):
    return Profile.Role.OFFICE if user.is_superuser else Profile.Role.TECHNICIAN


@receiver(post_save, sender=User)
def ensure_profile(sender, instance, created, **kwargs):
    """Guarantee every user has a Profile (superusers default to office)."""
    if created:
        Profile.objects.create(user=instance, role=_default_role(instance))
    else:
        Profile.objects.get_or_create(
            user=instance, defaults={"role": _default_role(instance)}
        )
