# Netwell Fiber

A modern, responsive Wi-Fi company website for Netwell, built with React (frontend) and Django (backend), styled with Tailwind CSS. All content is editable via Django admin and fetched via API.

## Features
- Responsive design, mobile-first
- Pages: Home, About, Pricing, Reviews, Blog, Contact
- Dynamic content: plans, reviews, blog posts, about
- Admin-editable via Django admin
- PostgreSQL database
- Security best practices

## Run with Docker

The stack runs with Docker Compose:
- **db** — PostgreSQL 16
- **backend** — Django + Gunicorn (runs migrations & collectstatic on start)
- **frontend** — nginx serving the built React app + reverse-proxying `/api`, `/admin`,
  `/media`, `/django-static` to the backend.

TLS/domain routing is handled by the **host nginx + certbot** on the VPS (see below);
containers stay private on a localhost port.

### Production deploy (Contabo VPS behind host nginx)

Assumes the server already runs nginx + certbot fronting other apps, each on its own port.

1. **Clone & configure**
	```bash
	cd ~ && git clone <repo-url> netwells && cd netwells
	cp .env.example .env
	nano .env    # set SECRET_KEY, POSTGRES_PASSWORD; confirm APP_PORT + domain vars
	```
	Keep `DEBUG=False`, cookies `Secure=True`. `APP_PORT` must be a free slot (e.g. 8120).

2. **Start containers** (migrations + collectstatic run automatically)
	```bash
	docker compose -f docker-compose.prod.yml up -d --build
	docker ps
	```

3. **Create admin user & (optional) sample data**
	```bash
	docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
	docker compose -f docker-compose.prod.yml exec backend python manage.py populate_data
	```

4. **Host nginx** — `/etc/nginx/sites-available/netwells.co.ke`:
	```nginx
	server {
	    listen 80;
	    server_name netwells.co.ke www.netwells.co.ke;
	    client_max_body_size 60m;

	    location / {
	        proxy_pass http://127.0.0.1:8120;   # = APP_PORT
	        proxy_http_version 1.1;
	        proxy_set_header Host              $host;
	        proxy_set_header X-Real-IP         $remote_addr;
	        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
	        proxy_set_header X-Forwarded-Proto $scheme;
	        proxy_read_timeout 60s;
	        proxy_send_timeout 60s;
	    }
	}
	```

5. **Enable + TLS**
	```bash
	ln -s /etc/nginx/sites-available/netwells.co.ke /etc/nginx/sites-enabled/
	nginx -t && systemctl reload nginx
	certbot --nginx -d netwells.co.ke -d www.netwells.co.ke
	```

6. **Verify**
	```bash
	curl -I https://netwells.co.ke
	docker ps
	```

Logs: `docker compose -f docker-compose.prod.yml logs -f`.
Update deploy: `git pull && docker compose -f docker-compose.prod.yml up -d --build`.

### Local testing

`docker compose up --build` (uses `docker-compose.yml`, plain HTTP) → http://localhost:3000.

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