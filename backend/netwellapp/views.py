from rest_framework import generics
from .models import PricingPlan, Review, BlogPost, AboutPage
from .serializers import PricingPlanSerializer, ReviewSerializer, BlogPostSerializer, AboutPageSerializer

class PricingPlanList(generics.ListAPIView):
    queryset = PricingPlan.objects.all()
    serializer_class = PricingPlanSerializer

class ReviewListCreate(generics.ListCreateAPIView):
    queryset = Review.objects.order_by('-timestamp')
    serializer_class = ReviewSerializer

class BlogPostList(generics.ListAPIView):
    queryset = BlogPost.objects.order_by('-created_at')
    serializer_class = BlogPostSerializer

class BlogPostDetail(generics.RetrieveAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

class AboutPageView(generics.RetrieveAPIView):
    queryset = AboutPage.objects.all()
    serializer_class = AboutPageSerializer
    def get_object(self):
        return AboutPage.objects.first()
