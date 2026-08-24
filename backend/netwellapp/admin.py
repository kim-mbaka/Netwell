from django.contrib import admin
from .models import PricingPlan, Review, BlogPost, AboutPage


@admin.register(PricingPlan)
class PricingPlanAdmin(admin.ModelAdmin):
    list_display = ('title', 'speed', 'price')
    search_fields = ('title', 'speed')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'timestamp')
    readonly_fields = ('timestamp',)


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'created_at')
    search_fields = ('title', 'slug', 'excerpt', 'body', 'meta_title', 'meta_description')
    readonly_fields = ('created_at',)
    prepopulated_fields = {'slug': ('title',)}


@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    list_display = ('id', 'content')
