from rest_framework import generics
from .models import PricingPlan, BlogPost, AboutPage
from .serializers import PricingPlanSerializer, BlogPostSerializer, AboutPageSerializer

class PricingPlanList(generics.ListAPIView):
    queryset = PricingPlan.objects.all()
    serializer_class = PricingPlanSerializer

class BlogPostList(generics.ListAPIView):
    queryset = BlogPost.objects.order_by('-created_at')
    serializer_class = BlogPostSerializer

class BlogPostDetail(generics.RetrieveAPIView):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'

class AboutPageView(generics.RetrieveAPIView):
    queryset = AboutPage.objects.all()
    serializer_class = AboutPageSerializer
    def get_object(self):
        return AboutPage.objects.first()
