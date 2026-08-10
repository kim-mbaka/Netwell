from django.db import models

class PricingPlan(models.Model):
    title = models.CharField(max_length=100)
    speed = models.CharField(max_length=50)
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
    image_filename = models.CharField(max_length=300, blank=True, default='', help_text='Filename of image in /public/images/blog/ (e.g., blog-post-1.jpg)')
    excerpt = models.CharField(max_length=300, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class AboutPage(models.Model):
    content = models.TextField()

    def __str__(self):
        return "About Page"
