import secrets

from django.conf import settings
from django.db import models
from django.utils import timezone

# Unambiguous alphabet (no 0/O, 1/I) for codes read aloud or copied by hand.
_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"


class Profile(models.Model):
    """
    Role attached to Django's built-in User.

    We keep the default auth.User (no custom AUTH_USER_MODEL) and hang the
    technician/office role off this one-to-one Profile, created automatically
    for every user. Superusers are treated as office.
    """

    class Role(models.TextChoices):
        TECHNICIAN = "technician", "Technician"
        OFFICE = "office", "Office"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.TECHNICIAN,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.user.username} ({self.get_role_display()})"


class InviteCode(models.Model):
    """
    Single-use registration invite. Office generates a code and hands it to a
    prospective technician; registration is refused without a valid, unused one.
    """

    code = models.CharField(max_length=12, unique=True, db_index=True)
    # The role a new account gets when registering with this code.
    role = models.CharField(
        max_length=20,
        choices=Profile.Role.choices,
        default=Profile.Role.TECHNICIAN,
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="invite_codes_created",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    used_by = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="invite_code_used",
    )
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    @property
    def is_used(self) -> bool:
        return self.used_by_id is not None

    def mark_used(self, user) -> None:
        self.used_by = user
        self.used_at = timezone.now()
        self.save(update_fields=["used_by", "used_at"])

    @classmethod
    def generate(cls, created_by=None, role=Profile.Role.TECHNICIAN) -> "InviteCode":
        """Create and persist a fresh, unique code (format: ABCD-2345)."""
        while True:
            raw = "".join(secrets.choice(_CODE_ALPHABET) for _ in range(8))
            code = f"{raw[:4]}-{raw[4:]}"
            if not cls.objects.filter(code=code).exists():
                return cls.objects.create(code=code, created_by=created_by, role=role)

    def __str__(self) -> str:
        return f"{self.code} ({'used' if self.is_used else 'available'})"
