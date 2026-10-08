from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('netwellapp', '0004_remove_blogpost_image_and_image_filename'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Review',
        ),
    ]
