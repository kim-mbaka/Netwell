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

    def validate_text(self, value):
        value = (value or '').strip()
        if len(value) < 2:
            raise serializers.ValidationError('Review is too short.')
        if len(value) > 1000:
            raise serializers.ValidationError('Review is too long (max 1000 characters).')
        return value

class BlogPostSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'body', 'image', 'image_filename', 'excerpt', 'created_at']

class AboutPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPage
        fields = ['id', 'content']
