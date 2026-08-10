# Generated migration for static blog images

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('netwellapp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='blogpost',
            name='image',
        ),
        migrations.AddField(
            model_name='blogpost',
            name='image_filename',
            field=models.CharField(blank=True, default='', help_text='Filename of image in /public/images/blog/ (e.g., blog-post-1.jpg)', max_length=300),
        ),
    ]
