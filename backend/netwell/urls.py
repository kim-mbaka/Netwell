from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def healthz(_request):
    """Liveness probe — 200 as long as the process can serve a request."""
    return JsonResponse({'status': 'ok'})


urlpatterns = [
    path('healthz', healthz),
    path('admin/', admin.site.urls),
    path('api/', include('netwellapp.api_urls')),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('reports.urls')),
]

# Serve uploaded media locally only when not using S3/MinIO.
if not settings.USE_S3:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
