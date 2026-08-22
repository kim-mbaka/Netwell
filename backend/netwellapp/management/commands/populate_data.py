from django.core.management.base import BaseCommand
from netwellapp.models import PricingPlan, BlogPost, AboutPage

class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        # Clear existing data
        PricingPlan.objects.all().delete()
        BlogPost.objects.all().delete()
        AboutPage.objects.all().delete()

        # Create pricing plans
        plans = [
            {
                'title': '4 Mbps Plan',
                'speed': '4 Mbps',
                'price': 1000,
                'features': ['Standard definition streaming', 'Basic voice calls', 'Light web browsing']
            },
            {
                'title': '8 Mbps Plan',
                'speed': '8 Mbps',
                'price': 1500,
                'features': ['Smooth HD streaming', 'Clear video calls', 'Social media scrolling']
            },
            {
                'title': '12 Mbps Plan',
                'speed': '12 Mbps',
                'price': 2000,
                'features': ['Dual device streaming', 'Group video meetings', 'Smart home basics']
            },
            {
                'title': '15 Mbps Plan',
                'speed': '15 Mbps',
                'price': 2500,
                'features': ['Single screen 4K', 'Multi device HD', 'Fast app downloads']
            },
            {
                'title': '20 Mbps Plan',
                'speed': '20 Mbps',
                'price': 3000,
                'features': ['Small household hub', 'Flawless multi streaming', 'Casual online gaming']
            },
        ]

        for plan in plans:
            PricingPlan.objects.create(**plan)
            self.stdout.write(self.style.SUCCESS(f"Created plan: {plan['title']}"))

        # Create blog posts
        blog_posts = [
            {
                'title': 'Why High-Speed Internet Matters',
                'body': 'High-speed internet is essential for modern life. From streaming entertainment to video calls, fast and reliable connectivity is crucial. Netwell Fiber provides the speeds you need for seamless online experiences.',
                'excerpt': 'Discover why high-speed internet is essential in today\'s digital world.'
            },
            {
                'title': 'Fiber Internet vs Traditional Broadband',
                'body': 'Fiber internet technology offers significant advantages over traditional broadband. With faster speeds, lower latency, and greater reliability, fiber is the future of connectivity. Learn how Netwell Fiber outperforms the competition.',
                'excerpt': 'Compare fiber internet with traditional broadband and see why fiber wins.'
            },
            {
                'title': 'Getting the Most Out of Your Internet',
                'body': 'Maximize your internet experience with these tips: position your router centrally, use wired connections for important tasks, and regularly check your speed. Netwell Fiber customers enjoy consistently fast speeds.',
                'excerpt': 'Tips and tricks to optimize your internet performance at home.'
            },
        ]

        for post in blog_posts:
            BlogPost.objects.create(**post)
            self.stdout.write(self.style.SUCCESS(f"Created blog post: {post['title']}"))

        # Create about page
        about = AboutPage.objects.create(
            content='Welcome to Netwell Fiber!\n\nWe are committed to providing the fastest, most reliable fiber internet service in the region. Our mission is to connect communities with high-speed internet that empowers businesses and homes.\n\nWith state-of-the-art infrastructure and customer-first service, Netwell Fiber is your trusted partner for digital connectivity.\n\nContact us today to learn more about our services!'
        )
        self.stdout.write(self.style.SUCCESS("Created about page"))
