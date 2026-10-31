from django.contrib import admin
from apps.departments.models import Department


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "hospital", "floor_location", "is_active", "created_at")
    list_filter = ("hospital", "is_active")
    search_fields = ("name", "code", "floor_location")
    ordering = ("hospital", "name")
