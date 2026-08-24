from django.db import models
from django.utils.text import slugify

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
    excerpt = models.CharField(max_length=300, blank=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    meta_title = models.CharField(max_length=200, blank=True, default='')
    meta_description = models.CharField(max_length=300, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            index = 1
            while BlogPost.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{index}"
                index += 1
            self.slug = slug

        if not self.meta_title:
            self.meta_title = self.title

        if not self.meta_description:
            self.meta_description = self.excerpt or (self.body[:160].strip() if self.body else '')

        super().save(*args, **kwargs)

class AboutPage(models.Model):
    content = models.TextField()

    def __str__(self):
        return "About Page"
