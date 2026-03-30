# Netwell Backend

Django backend for Netwell Fiber. Provides API endpoints for plans, reviews, blog posts, and about page. All content is editable via Django admin.

## Setup
- Copy `.env.example` to `.env` and fill in your secrets.
- Install dependencies: `pip install -r requirements.txt`
- Configure PostgreSQL and update `DATABASE_URL` in `.env`.
- Run migrations: `python manage.py migrate`
- Create superuser: `python manage.py createsuperuser`
- Run server: `python manage.py runserver`

## Security
- Set `DEBUG=False` in production.
- Use strong passwords and secure cookies.
- Serve over HTTPS in production.
