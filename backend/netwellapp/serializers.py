from rest_framework import serializers
from .models import PricingPlan, Review, BlogPost, AboutPage

class PricingPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingPlan
        fields = ['id', 'title', 'speed', 'price', 'features']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'text', 'timestamp']

class BlogPostSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'body', 'image', 'image_filename', 'excerpt', 'created_at']

class AboutPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPage
        fields = ['id', 'content']
