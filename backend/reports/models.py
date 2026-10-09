from django.conf import settings
from django.db import models


class Material(models.Model):
    """Catalog of materials a technician can consume on a job. Seeded once."""

    name = models.CharField(max_length=100, unique=True)
    unit = models.CharField(max_length=30, default="unit")
    current_stock = models.IntegerField(default=0)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Report(models.Model):
    """One report per job visit, submitted by a technician."""

    class WorkType(models.TextChoices):
        NEW_INSTALLATION = "new_installation", "New Installation"
        ROUTER_INSTALLATION = "router_installation", "Router Installation"
        FIBER_REPAIR = "fiber_repair", "Fiber Repair"
        CABLE_REPLACEMENT = "cable_replacement", "Cable Replacement"
        ROUTER_CONFIGURATION = "router_configuration", "Router Configuration"
        SITE_SURVEY = "site_survey", "Site Survey"
        MAINTENANCE = "maintenance", "Maintenance"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        COMPLETED = "completed", "Completed"
        PENDING = "pending", "Pending"
        FOLLOW_UP = "follow_up", "Follow-up Required"
        CUSTOMER_NOT_AVAILABLE = "customer_not_available", "Customer Not Available"

    class PendingReason(models.TextChoices):
        EQUIPMENT_UNAVAILABLE = "equipment_unavailable", "Equipment unavailable"
        CUSTOMER_ABSENT = "customer_absent", "Customer absent"
        POWER_ISSUE = "power_issue", "Power issue"
        NETWORK_ISSUE = "network_issue", "Network issue"
        OTHER = "other", "Other"

    technician = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reports",
    )
    date = models.DateField()
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)

    # A job can be done by an individual or a team. When it's a team, the
    # submitting technician is the lead and `team_members` holds the others.
    is_team = models.BooleanField(default=False)
    team_members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="team_reports",
        blank=True,
    )

    # Optional: site surveys and fibre repairs are not tied to a named customer.
    customer_name = models.CharField(max_length=150, blank=True)
    customer_phone = models.CharField(max_length=30, blank=True)
    customer_location = models.CharField(max_length=255, blank=True)
    unit_number = models.CharField(max_length=50, blank=True)

    work_type = models.CharField(max_length=30, choices=WorkType.choices)
    work_performed = models.TextField(blank=True)

    status = models.CharField(max_length=30, choices=Status.choices)
    pending_reason = models.CharField(
        max_length=30,
        choices=PendingReason.choices,
        null=True,
        blank=True,
    )
    remarks = models.TextField(blank=True)

    # Office-use fields.
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_reports",
    )
    follow_up_date = models.DateField(null=True, blank=True)
    inventory_updated = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    materials = models.ManyToManyField(
        Material,
        through="ReportMaterial",
        related_name="reports",
        blank=True,
    )

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self) -> str:
        return f"{self.date} · {self.customer_name} · {self.get_status_display()}"


class ReportPhoto(models.Model):
    """Proof-of-work image attached to a report (stored in MinIO/S3)."""

    report = models.ForeignKey(
        Report,
        on_delete=models.CASCADE,
        related_name="photos",
    )
    image = models.ImageField(upload_to="report_photos/%Y/%m/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["uploaded_at"]

    def __str__(self) -> str:
        return f"Photo for report {self.report_id}"


class ReportMaterial(models.Model):
    """Quantity of a given material consumed on a specific report."""

    report = models.ForeignKey(
        Report,
        on_delete=models.CASCADE,
        related_name="materials_used",
    )
    material = models.ForeignKey(
        Material,
        on_delete=models.PROTECT,
        related_name="usages",
    )
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ("report", "material")

    def __str__(self) -> str:
        return f"{self.material.name} × {self.quantity}"
