from django.contrib import admin

from .models import Material, Report, ReportMaterial, ReportPhoto


class ReportMaterialInline(admin.TabularInline):
    model = ReportMaterial
    extra = 0


class ReportPhotoInline(admin.TabularInline):
    model = ReportPhoto
    extra = 0
    readonly_fields = ("uploaded_at",)


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ("name", "unit", "current_stock")
    search_fields = ("name",)


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ("date", "technician", "customer_name", "work_type", "status", "created_at")
    list_filter = ("status", "work_type", "date")
    search_fields = ("customer_name", "customer_phone", "customer_location", "unit_number")
    readonly_fields = ("created_at",)
    inlines = [ReportMaterialInline, ReportPhotoInline]
