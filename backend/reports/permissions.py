from rest_framework import permissions

from accounts.roles import is_office, is_technician


class IsOffice(permissions.BasePermission):
    """Allow access only to authenticated users with the office role."""

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and is_office(request.user)
        )


class ReportAccessPermission(permissions.BasePermission):
    """
    Report access policy:
      - Office is view-only: may read (GET) any report, but may not create,
        edit, delete, or attach photos. (Office reviews via the dedicated
        /review/ action, which has its own IsOffice permission.)
      - Technicians create reports and may read/edit/attach photos only on their
        own reports.
    """

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if request.method not in permissions.SAFE_METHODS:
            return is_technician(user)
        return True

    def has_object_permission(self, request, view, obj):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if request.method in permissions.SAFE_METHODS:
            return is_office(user) or obj.technician_id == user.id
        return is_technician(user) and obj.technician_id == user.id
