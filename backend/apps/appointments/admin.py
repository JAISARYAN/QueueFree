from django.contrib import admin
from apps.appointments.models import AppointmentSlot


@admin.register(AppointmentSlot)
class AppointmentSlotAdmin(admin.ModelAdmin):
    list_display = (
        "doctor",
        "hospital",
        "slot_date",
        "start_time",
        "end_time",
        "slot_type",
        "is_booked",
        "is_blocked",
    )
    list_filter = ("slot_date", "slot_type", "is_booked", "is_blocked", "hospital")
    search_fields = ("doctor__user__first_name", "doctor__user__last_name", "doctor__specialization")
    ordering = ("slot_date", "start_time")
