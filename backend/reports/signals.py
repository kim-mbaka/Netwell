import logging

from django.db.models import F
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Material, ReportMaterial

logger = logging.getLogger(__name__)


@receiver(post_save, sender=ReportMaterial)
def deduct_stock_on_material_use(sender, instance, created, **kwargs):
    """
    When a material row is added to a report, decrement that material's stock.

    Going negative is deliberately allowed and only flagged (logged) — a stock
    count that lags reality must never block a technician from submitting a
    report from the field.
    """
    if not created:
        return

    # Atomic decrement to avoid read-modify-write races.
    Material.objects.filter(pk=instance.material_id).update(
        current_stock=F("current_stock") - instance.quantity
    )

    material = Material.objects.get(pk=instance.material_id)
    if material.current_stock < 0:
        logger.warning(
            "Material '%s' stock is negative (%s) after report %s used %s.",
            material.name,
            material.current_stock,
            instance.report_id,
            instance.quantity,
        )

    if not instance.report.inventory_updated:
        instance.report.inventory_updated = True
        instance.report.save(update_fields=["inventory_updated"])
