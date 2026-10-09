from django.contrib import admin

from .models import InviteCode, Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "created_at")
    list_filter = ("role",)
    search_fields = ("user__username", "user__first_name", "user__last_name")


@admin.register(InviteCode)
class InviteCodeAdmin(admin.ModelAdmin):
    list_display = ("code", "role", "created_by", "created_at", "used_by", "used_at")
    list_filter = ("role",)
    search_fields = ("code",)
    readonly_fields = ("used_by", "used_at", "created_at")
