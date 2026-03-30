from django.urls import path
from . import views

urlpatterns = [
    path('plans/', views.PricingPlanList.as_view()),
    path('reviews/', views.ReviewListCreate.as_view()),
    path('blog/', views.BlogPostList.as_view()),
    path('blog/<int:pk>/', views.BlogPostDetail.as_view()),
    path('about/', views.AboutPageView.as_view()),
]
