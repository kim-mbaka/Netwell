from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core import signing
from django.db import transaction
from django.db.models import F
from django.utils import timezone
from PIL import Image
from rest_framework import serializers

from accounts.models import Profile

from .models import Material, Report, ReportMaterial, ReportPhoto

User = get_user_model()

PHOTO_TOKEN_SALT = "reportphoto"

# How far back a report may be dated (older dates are almost always typos).
REPORT_BACKLOG_DAYS = 14

# Statuses that mean the job wasn't cleanly completed and so must carry a reason.
STATUSES_NEEDING_REASON = {
    Report.Status.PENDING,
    Report.Status.FOLLOW_UP,
    Report.Status.CUSTOMER_NOT_AVAILABLE,
}


def photo_token(photo_id: int) -> str:
    """Signed, expiring capability token for one photo (validated on serve)."""
    return signing.dumps(photo_id, salt=PHOTO_TOKEN_SALT)


class ReportPhotoSerializer(serializers.ModelSerializer):
    # A signed, time-limited URL served by our own authenticated endpoint —
    # never a public object-storage URL.
    image = serializers.SerializerMethodField()

    class Meta:
        model = ReportPhoto
        fields = ("id", "image", "uploaded_at")

    def get_image(self, obj) -> str:
        path = f"/api/media/photo/{photo_token(obj.id)}/"
        request = self.context.get("request")
        return request.build_absolute_uri(path) if request else path


class UploadPhotoSerializer(serializers.Serializer):
    image = serializers.ImageField()

    def validate_image(self, image):
        if image.size > 10 * 1024 * 1024:
            raise serializers.ValidationError("Image must be 10 MB or smaller.")
        try:
            width, height = Image.open(image).size
        except Exception:
            raise serializers.ValidationError("Not a valid image file.")
        finally:
            image.seek(0)
        if width > 8000 or height > 8000:
            raise serializers.ValidationError("Image dimensions must not exceed 8000 by 8000 pixels.")
        return image


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = ("id", "name", "unit", "current_stock")


class ReportMaterialSerializer(serializers.ModelSerializer):
    """Nested material-usage row: writes accept a material id + quantity."""

    material_name = serializers.CharField(source="material.name", read_only=True)
    unit = serializers.CharField(source="material.unit", read_only=True)

    class Meta:
        model = ReportMaterial
        fields = ("id", "material", "material_name", "unit", "quantity")


class ReviewSerializer(serializers.ModelSerializer):
    """Office-only review write: touches exactly these three fields."""

    class Meta:
        model = Report
        fields = ("reviewed_by", "follow_up_date", "inventory_updated")

    def validate_follow_up_date(self, value):
        if value and value < timezone.localdate():
            raise serializers.ValidationError("Follow-up date can't be in the past.")
        return value


class ReportSerializer(serializers.ModelSerializer):
    materials_used = ReportMaterialSerializer(many=True, required=False)
    photos = ReportPhotoSerializer(many=True, read_only=True)
    technician_name = serializers.CharField(
        source="technician.get_full_name", read_only=True
    )
    technician_username = serializers.CharField(
        source="technician.username", read_only=True
    )
    reviewed_by_username = serializers.CharField(
        source="reviewed_by.username", read_only=True, default=None
    )
    team_members = serializers.PrimaryKeyRelatedField(
        many=True,
        required=False,
        queryset=User.objects.filter(profile__role=Profile.Role.TECHNICIAN),
    )
    team_member_details = serializers.SerializerMethodField()

    def get_team_member_details(self, obj):
        return [
            {
                "id": u.id,
                "username": u.username,
                "name": u.get_full_name() or u.username,
            }
            for u in obj.team_members.all()
        ]

    class Meta:
        model = Report
        fields = (
            "id",
            "technician",
            "technician_name",
            "technician_username",
            "is_team",
            "team_members",
            "team_member_details",
            "date",
            "start_time",
            "end_time",
            "customer_name",
            "customer_phone",
            "customer_location",
            "unit_number",
            "work_type",
            "work_performed",
            "status",
            "pending_reason",
            "remarks",
            "materials_used",
            "photos",
            "reviewed_by",
            "reviewed_by_username",
            "follow_up_date",
            "inventory_updated",
            "created_at",
        )
        # Office-use fields are managed via the dedicated review endpoint,
        # never through report create/update here.
        read_only_fields = (
            "technician",
            "reviewed_by",
            "follow_up_date",
            "inventory_updated",
            "created_at",
        )

    def validate(self, attrs):
        report_date = attrs.get("date") or getattr(self.instance, "date", None)
        start = attrs.get("start_time", getattr(self.instance, "start_time", None))
        end = attrs.get("end_time", getattr(self.instance, "end_time", None))
        status = attrs.get("status", getattr(self.instance, "status", None))
        reason = attrs.get("pending_reason", getattr(self.instance, "pending_reason", None))

        today = timezone.localdate()
        if report_date and report_date > today:
            raise serializers.ValidationError(
                {"date": "The report date can't be in the future."}
            )
        if report_date and report_date < today - timedelta(days=REPORT_BACKLOG_DAYS):
            raise serializers.ValidationError(
                {"date": f"The report date can't be more than {REPORT_BACKLOG_DAYS} days ago."}
            )
        if start and end and end <= start:
            raise serializers.ValidationError(
                {"end_time": "End time must be after the start time."}
            )
        if status in STATUSES_NEEDING_REASON and not reason:
            raise serializers.ValidationError(
                {"pending_reason": "Please select a reason for this status."}
            )
        return attrs

    def create(self, validated_data):
        materials_data = validated_data.pop("materials_used", [])
        team_members = validated_data.pop("team_members", [])
        material_ids = [row["material"].id for row in materials_data]
        if len(material_ids) != len(set(material_ids)):
            raise serializers.ValidationError({"materials_used": "Each material may appear only once."})
        with transaction.atomic():
            report = Report.objects.create(**validated_data)
            if team_members:
                report.team_members.set(team_members)
            for row in materials_data:
                ReportMaterial.objects.create(report=report, **row)
        return report

    def update(self, instance, validated_data):
        materials_data = validated_data.pop("materials_used", None)
        team_members = validated_data.pop("team_members", None)
        with transaction.atomic():
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
            if team_members is not None:
                instance.team_members.set(team_members)
            if materials_data is not None:
                material_ids = [row["material"].id for row in materials_data]
                if len(material_ids) != len(set(material_ids)):
                    raise serializers.ValidationError({"materials_used": "Each material may appear only once."})

                existing = {
                    row.material_id: row
                    for row in instance.materials_used.select_related("material")
                }
                incoming = {row["material"].id: row["quantity"] for row in materials_data}
                for material_id, row in existing.items():
                    new_quantity = incoming.get(material_id, 0)
                    if new_quantity != row.quantity:
                        Material.objects.filter(pk=material_id).update(
                            current_stock=F("current_stock") + row.quantity - new_quantity
                        )
                    if new_quantity:
                        row.quantity = new_quantity
                        row.save(update_fields=["quantity"])
                    else:
                        row.delete()
                for row in materials_data:
                    if row["material"].id not in existing:
                        ReportMaterial.objects.create(report=instance, **row)
        return instance
