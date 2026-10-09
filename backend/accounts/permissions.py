from rest_framework import permissions

from .roles import is_office


class IsOfficeUser(permissions.BasePermission):
    """Allow access only to authenticated users with the office role."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and is_office(request.user))
