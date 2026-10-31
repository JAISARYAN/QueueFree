from django.contrib import admin
from apps.doctors.models import Doctor, DoctorShift


class DoctorShiftInline(admin.TabularInline):
    model = DoctorShift
    extra = 1


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "specialization",
        "hospital",
        "department",
        "license_number",
        "room_number",
        "is_active",
    )
    list_filter = ("hospital", "department", "is_active", "is_available_for_teleconsult")
    search_fields = ("user__first_name", "user__last_name", "user__email", "license_number", "specialization")
    inlines = [DoctorShiftInline]


@admin.register(DoctorShift)
class DoctorShiftAdmin(admin.ModelAdmin):
    list_display = ("doctor", "day_of_week", "start_time", "end_time", "slot_duration_minutes", "is_active")
    list_filter = ("day_of_week", "is_active", "doctor__hospital")
    ordering = ("day_of_week", "start_time")
