"""Role helpers — the single source of truth for "is this user office/tech".

Roles live on `Profile.role`; superusers are always treated as office so the
owner can review reports without a seeded profile.
"""

from .models import Profile


def role_of(user):
    if not user or not getattr(user, "is_authenticated", False):
        return None
    if getattr(user, "is_superuser", False):
        return Profile.Role.OFFICE
    profile = getattr(user, "profile", None)
    return profile.role if profile else Profile.Role.TECHNICIAN


def is_office(user) -> bool:
    return role_of(user) == Profile.Role.OFFICE


def is_technician(user) -> bool:
    return role_of(user) == Profile.Role.TECHNICIAN
