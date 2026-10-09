from django.core.management.base import BaseCommand

from reports.models import Material

# (name, unit) for the 8 known catalog materials.
MATERIALS = [
    ("Drop Fiber", "meters"),
    ("Fast Connector", "unit"),
    ("Patch Cord", "unit"),
    ("Router", "unit"),
    ("ONU/ONT", "unit"),
    ("RJ45 Connectors", "unit"),
    ("LAN Cable", "meters"),
    ("Other", "unit"),
]


class Command(BaseCommand):
    help = "Idempotently seed the material catalog with the 8 known materials."

    def handle(self, *args, **options):
        created_count = 0
        for name, unit in MATERIALS:
            _, created = Material.objects.get_or_create(
                name=name,
                defaults={"unit": unit},
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created: {name}"))
            else:
                self.stdout.write(f"Exists:  {name}")

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete — {created_count} created, "
                f"{Material.objects.count()} total in catalog."
            )
        )
