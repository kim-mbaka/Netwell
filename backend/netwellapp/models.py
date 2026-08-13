from django.db import models

class PricingPlan(models.Model):
    title = models.CharField(max_length=100)
    speed = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True,
                                help_text='Monthly price in KES (e.g. 2500). Leave blank to hide.')
    features = models.JSONField(default=list)

    def __str__(self):
        return self.title

class Review(models.Model):
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review {self.id}"

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    image = models.ImageField(upload_to='blog/', blank=True, null=True,
                              help_text='Upload a featured image (recommended). Takes priority over the legacy filename below.')
    image_filename = models.CharField(max_length=300, blank=True, default='', help_text='Legacy: filename of a bundled image in /public/images/blog/. Prefer the upload field above.')
    excerpt = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class AboutPage(models.Model):
    content = models.TextField()

    def __str__(self):
        return "About Page"
