from rest_framework import serializers
from .models import PricingPlan, BlogPost, AboutPage

class PricingPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingPlan
        fields = ['id', 'title', 'speed', 'price', 'features']

class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'body', 'excerpt', 'meta_title', 'meta_description', 'created_at']

class AboutPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPage
        fields = ['id', 'content']
