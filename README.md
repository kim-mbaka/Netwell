# Netwell Fiber

A modern, responsive Wi-Fi company website for Netwell, built with React (frontend) and Django (backend), styled with Tailwind CSS. All content is editable via Django admin and fetched via API.

## Features
- Responsive design, mobile-first
- Pages: Home, About, Pricing, Reviews, Blog, Contact
- Dynamic content: plans, reviews, blog posts, about
- Admin-editable via Django admin
- PostgreSQL database
- Security best practices

## Deployment
## Step-by-Step Setup & Run Instructions

### 1. Backend Setup

1. Open a terminal and navigate to the backend folder:
	```bash
	cd backend
	```
2. Create a Python virtual environment:
	```bash
	python -m venv venv
	venv\Scripts\activate  # On Windows
	# or
	source venv/bin/activate  # On Mac/Linux
	```
3. Install Python dependencies:
	```bash
	pip install -r requirements.txt
	```
4. Copy the example environment file and edit it:
	```bash
	copy .env.example .env  # On Windows
	# or
	cp .env.example .env    # On Mac/Linux
	# Edit .env and set your DJANGO_SECRET_KEY and database info
	```
5. Configure PostgreSQL:
	- Make sure PostgreSQL is running.
	- Create a database and user matching your `.env` settings.

6. Run migrations to set up the database:
	```bash
	python manage.py migrate
	```
7. Create a Django superuser for admin access:
	```bash
	python manage.py createsuperuser
	```
8. (Optional) Collect static files for production:
	```bash
	python manage.py collectstatic
	```

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
	```bash
	cd frontend
	```
2. Install Node.js dependencies:
	```bash
	npm install
	```

### 3. Running the Website (Development)

1. Start the Django backend (from the backend folder):
	```bash
	python manage.py runserver
	```
2. In a separate terminal, start the React frontend (from the frontend folder):
	```bash
	npm start
	```
3. Open your browser and go to:
	- Frontend: http://localhost:3000
	- Backend API: http://localhost:8000/api/
	- Django Admin: http://localhost:8000/admin/

### 4. Production Build & Deployment

1. Build the React frontend for production:
	```bash
	npm run build
	```
2. Collect static files in Django:
	```bash
	cd ../backend
	python manage.py collectstatic
	```
3. Run Django with Gunicorn (example):
	```bash
	gunicorn netwell.wsgi:application
	```
4. Ensure HTTPS is enabled (TLS/SSL on your server).

### 5. Final Checks

- Log in to Django admin and add/edit plans, reviews, blog posts, and about page content.
- Visit the site and confirm all features work as intended.

---

For more details, see backend/README.md and .github/copilot-instructions.md.