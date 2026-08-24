from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('netwellapp', '0003_blogpost_image_pricingplan_price_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='blogpost',
            name='image',
        ),
        migrations.RemoveField(
            model_name='blogpost',
            name='image_filename',
        ),
    ]
