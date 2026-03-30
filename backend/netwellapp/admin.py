from django.contrib import admin
from .models import PricingPlan, Review, BlogPost, AboutPage

admin.site.register(PricingPlan)
admin.site.register(Review)
admin.site.register(BlogPost)
admin.site.register(AboutPage)
