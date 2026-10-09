from django.db import migrations


def create_profiles(apps, schema_editor):
    """Give every existing user a Profile (superusers -> office, else technician)."""
    User = apps.get_model("auth", "User")
    Profile = apps.get_model("accounts", "Profile")
    for user in User.objects.all():
        role = "office" if user.is_superuser else "technician"
        Profile.objects.get_or_create(user=user, defaults={"role": role})


def noop_reverse(apps, schema_editor):
    # Profiles are dropped with the table on full reverse; nothing to undo here.
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_profiles, noop_reverse),
    ]
