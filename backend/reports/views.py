import mimetypes
from datetime import date

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import signing
from django.db.models import Count, Q, Sum
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Profile
from accounts.roles import is_office

from .models import Material, Report, ReportMaterial, ReportPhoto
from .permissions import IsOffice, ReportAccessPermission
from .serializers import (
    PHOTO_TOKEN_SALT,
    MaterialSerializer,
    ReportPhotoSerializer,
    ReportSerializer,
    ReviewSerializer,
    UploadPhotoSerializer,
)

INSTALL_TYPES = [Report.WorkType.NEW_INSTALLATION, Report.WorkType.ROUTER_INSTALLATION]
REPAIR_TYPES = [Report.WorkType.FIBER_REPAIR, Report.WorkType.CABLE_REPLACEMENT]

User = get_user_model()


class TechnicianListView(APIView):
    """List technicians so a report author can build a team. Any signed-in user."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        techs = User.objects.filter(
            profile__role=Profile.Role.TECHNICIAN
        ).order_by("username")
        return Response(
            [
                {"id": u.id, "username": u.username, "name": u.get_full_name() or u.username}
                for u in techs
            ]
        )


class MaterialViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only catalog used to populate the report form's material picker."""

    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None


class ReportViewSet(viewsets.ModelViewSet):
    """
    Technicians create and see only their own reports; office sees all and can
    filter by date, technician, and status.
    """

    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated, ReportAccessPermission]
    filterset_fields = ["date", "technician", "status"]

    def get_queryset(self):
        user = self.request.user
        qs = (
            Report.objects.select_related("technician", "reviewed_by")
            .prefetch_related("materials_used__material", "team_members", "photos")
            .all()
        )
        if is_office(user):
            return qs
        return qs.filter(technician=user)

    def perform_create(self, serializer):
        serializer.save(technician=self.request.user)

    @action(
        detail=True,
        methods=["post"],
        url_path="photos",
        parser_classes=[MultiPartParser, FormParser],
    )
    def photos(self, request, pk=None):
        """Attach a proof-of-work image to a report (owning technician)."""
        report = self.get_object()  # enforces per-technician scoping
        serializer = UploadPhotoSerializer(data=request.FILES)
        serializer.is_valid(raise_exception=True)
        photo = ReportPhoto.objects.create(report=report, **serializer.validated_data)
        return Response(
            ReportPhotoSerializer(photo, context={"request": request}).data,
            status=201,
        )

    @action(
        detail=True,
        methods=["patch"],
        permission_classes=[permissions.IsAuthenticated, IsOffice],
        serializer_class=ReviewSerializer,
    )
    def review(self, request, pk=None):
        """Office-only: update reviewed_by, follow_up_date, inventory_updated."""
        report = self.get_object()
        serializer = ReviewSerializer(report, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        if "reviewed_by" not in serializer.validated_data:
            serializer.save(reviewed_by=request.user)
        else:
            serializer.save()
        return Response(ReportSerializer(report, context={"request": request}).data)


class PhotoFileView(APIView):
    """
    Stream a proof-of-work photo for a valid signed, time-limited token.

    The token is the capability (like an S3 presigned URL): it is only handed out
    inside authenticated report responses and expires after PHOTO_URL_TTL. The
    object store stays private and is never exposed to the internet.
    """

    authentication_classes = []
    permission_classes = [permissions.AllowAny]
    throttle_classes = []

    def get(self, request, token):
        try:
            photo_id = signing.loads(
                token, salt=PHOTO_TOKEN_SALT, max_age=settings.PHOTO_URL_TTL
            )
        except signing.SignatureExpired:
            return Response({"detail": "This image link has expired."}, status=410)
        except signing.BadSignature:
            raise Http404

        photo = get_object_or_404(ReportPhoto, pk=photo_id)
        try:
            fh = photo.image.open("rb")
        except (FileNotFoundError, OSError):
            raise Http404
        content_type = mimetypes.guess_type(photo.image.name)[0] or "application/octet-stream"
        response = FileResponse(fh, content_type=content_type)
        response["Cache-Control"] = f"private, max-age={settings.PHOTO_URL_TTL}"
        return response


class DashboardSummaryView(APIView):
    """Daily summary numbers for the office dashboard."""

    permission_classes = [permissions.IsAuthenticated, IsOffice]

    def get(self, request):
        day = parse_date(request.query_params.get("date", "")) or date.today()
        reports = Report.objects.filter(date=day)

        counts = reports.aggregate(
            jobs_assigned=Count("id"),
            jobs_completed=Count("id", filter=Q(status=Report.Status.COMPLETED)),
            jobs_pending=Count("id", filter=Q(status=Report.Status.PENDING)),
            follow_up_required=Count("id", filter=Q(status=Report.Status.FOLLOW_UP)),
            customer_not_available=Count(
                "id", filter=Q(status=Report.Status.CUSTOMER_NOT_AVAILABLE)
            ),
            installs_completed=Count(
                "id",
                filter=Q(status=Report.Status.COMPLETED, work_type__in=INSTALL_TYPES),
            ),
            repairs_completed=Count(
                "id",
                filter=Q(status=Report.Status.COMPLETED, work_type__in=REPAIR_TYPES),
            ),
        )

        materials_used = list(
            ReportMaterial.objects.filter(report__date=day)
            .values("material__name", "material__unit")
            .annotate(total_quantity=Sum("quantity"))
            .order_by("material__name")
        )

        return Response(
            {
                "date": day.isoformat(),
                **counts,
                "materials_used": [
                    {
                        "material": row["material__name"],
                        "unit": row["material__unit"],
                        "total_quantity": row["total_quantity"],
                    }
                    for row in materials_used
                ],
            }
        )


class TechnicianStatsView(APIView):
    """Per-technician job counts for a given month (YYYY-MM)."""

    permission_classes = [permissions.IsAuthenticated, IsOffice]

    def get(self, request):
        month = request.query_params.get("month", "")
        try:
            year, mon = (int(p) for p in month.split("-"))
        except (ValueError, AttributeError):
            today = date.today()
            year, mon = today.year, today.month

        reports = Report.objects.filter(date__year=year, date__month=mon)
        rows = (
            reports.values("technician__id", "technician__username")
            .annotate(
                total=Count("id"),
                completed=Count("id", filter=Q(status=Report.Status.COMPLETED)),
                pending=Count("id", filter=Q(status=Report.Status.PENDING)),
                follow_up=Count("id", filter=Q(status=Report.Status.FOLLOW_UP)),
            )
            .order_by("-total")
        )

        return Response(
            {
                "month": f"{year:04d}-{mon:02d}",
                "technicians": [
                    {
                        "technician_id": r["technician__id"],
                        "username": r["technician__username"],
                        "total": r["total"],
                        "completed": r["completed"],
                        "pending": r["pending"],
                        "follow_up": r["follow_up"],
                    }
                    for r in rows
                ],
            }
        )
