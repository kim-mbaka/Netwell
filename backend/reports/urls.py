from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    DashboardSummaryView,
    MaterialViewSet,
    PhotoFileView,
    ReportViewSet,
    TechnicianListView,
    TechnicianStatsView,
)

router = DefaultRouter()
router.register(r"reports", ReportViewSet, basename="report")
router.register(r"materials", MaterialViewSet, basename="material")

urlpatterns = [
    path("dashboard/summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),
    path("dashboard/technicians/", TechnicianStatsView.as_view(), name="dashboard-technicians"),
    path("technicians/", TechnicianListView.as_view(), name="technician-list"),
    path("media/photo/<str:token>/", PhotoFileView.as_view(), name="photo-file"),
    *router.urls,
]
