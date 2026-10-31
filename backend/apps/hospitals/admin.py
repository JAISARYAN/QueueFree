from django.contrib import admin
from apps.hospitals.models import Hospital


@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "city", "state", "is_active", "created_at")
    list_filter = ("city", "state", "is_active")
    search_fields = ("name", "code", "city")
    ordering = ("name",)
