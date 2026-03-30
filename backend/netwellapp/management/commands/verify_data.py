from django.core.management.base import BaseCommand
from netwellapp.models import PricingPlan, BlogPost, AboutPage, Review

class Command(BaseCommand):
    help = 'Verify database data'

    def handle(self, *args, **options):
        plans = PricingPlan.objects.all()
        posts = BlogPost.objects.all()
        about = AboutPage.objects.first()
        reviews = Review.objects.all()
        
        self.stdout.write(self.style.SUCCESS(f"✓ Pricing Plans: {plans.count()}"))
        for plan in plans:
            self.stdout.write(f"  - {plan.id}: {plan.title}")
        
        self.stdout.write(self.style.SUCCESS(f"✓ Blog Posts: {posts.count()}"))
        for post in posts:
            self.stdout.write(f"  - {post.id}: {post.title}")
        
        if about:
            self.stdout.write(self.style.SUCCESS(f"✓ About Page: EXISTS"))
        else:
            self.stdout.write(self.style.WARNING(f"✗ About Page: MISSING"))
        
        self.stdout.write(self.style.SUCCESS(f"✓ Reviews: {reviews.count()}"))
