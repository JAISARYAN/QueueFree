from django.db import models
from apps.core.models import TimeStampedModel


class SlotType(models.TextChoices):
    ONLINE = "ONLINE", "Online Booking"
    WALKIN_BUFFER = "WALKIN_BUFFER", "Walk-in Buffer"
    VIP_EMERGENCY = "VIP_EMERGENCY", "Priority / Emergency"


class AppointmentSlot(TimeStampedModel):
    """
    Atomic OPD consultation time slot generated for a doctor on a specific calendar date.
    Supports concurrency control via optimistic locking version counters.
    """

    doctor = models.ForeignKey(
        "doctors.Doctor",
        on_delete=models.CASCADE,
        related_name="appointment_slots",
        help_text="Doctor conducting the OPD consultation.",
    )
    hospital = models.ForeignKey(
        "hospitals.Hospital",
        on_delete=models.CASCADE,
        related_name="appointment_slots",
        help_text="Hospital facility where consultation occurs.",
    )
    slot_date = models.DateField(
        db_index=True,
        help_text="Calendar date of the appointment slot.",
    )
    start_time = models.TimeField(
        help_text="Slot start time (HH:MM:SS).",
    )
    end_time = models.TimeField(
        help_text="Slot end time (HH:MM:SS).",
    )
    slot_type = models.CharField(
        max_length=20,
        choices=SlotType.choices,
        default=SlotType.ONLINE,
        help_text="Slot reservation pool / queue category.",
    )
    is_booked = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Whether slot has been reserved by an active booking.",
    )
    is_blocked = models.BooleanField(
        default=False,
        help_text="Whether slot is temporarily blocked or unavailable (e.g. doctor emergency / leave).",
    )
    version = models.PositiveIntegerField(
        default=0,
        help_text="Optimistic locking version counter to prevent race conditions during booking.",
    )

    class Meta:
        db_table = "appointment_slots"
        verbose_name = "Appointment Slot"
        verbose_name_plural = "Appointment Slots"
        ordering = ["slot_date", "start_time"]
        constraints = [
            models.UniqueConstraint(
                fields=["doctor", "slot_date", "start_time"],
                name="unique_doctor_slot_start",
            )
        ]
        indexes = [
            models.Index(fields=["doctor", "slot_date", "is_booked"], name="idx_slot_lookup"),
            models.Index(fields=["hospital", "slot_date"], name="idx_slot_hosp_date"),
        ]

    def __str__(self) -> str:
        status_str = "BOOKED" if self.is_booked else ("BLOCKED" if self.is_blocked else "AVAILABLE")
        return (
            f"{self.doctor.full_name} | {self.slot_date} "
            f"{self.start_time.strftime('%H:%M')}-{self.end_time.strftime('%H:%M')} [{status_str}]"
        )
