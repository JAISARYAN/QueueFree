from django.db import models
from apps.core.models import TimeStampedModel


class DayOfWeek(models.IntegerChoices):
    MONDAY = 0, "Monday"
    TUESDAY = 1, "Tuesday"
    WEDNESDAY = 2, "Wednesday"
    THURSDAY = 3, "Thursday"
    FRIDAY = 4, "Friday"
    SATURDAY = 5, "Saturday"
    SUNDAY = 6, "Sunday"


class Doctor(TimeStampedModel):
    """
    Doctor clinical profile affiliated with a hospital and department.
    """

    user = models.OneToOneField(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="doctor_profile",
        help_text="User identity account affiliated with this clinician.",
    )
    hospital = models.ForeignKey(
        "hospitals.Hospital",
        on_delete=models.CASCADE,
        related_name="doctors",
        help_text="Primary hospital facility where this doctor practices.",
    )
    department = models.ForeignKey(
        "departments.Department",
        on_delete=models.RESTRICT,
        related_name="doctors",
        help_text="Clinical department specialty of this doctor.",
    )
    license_number = models.CharField(
        max_length=100,
        unique=True,
        db_index=True,
        help_text="Medical registration/license council identifier (e.g. NMC/MCI).",
    )
    specialization = models.CharField(
        max_length=255,
        help_text="Specific clinical specialization (e.g., Senior Interventional Cardiologist).",
    )
    qualifications = models.CharField(
        max_length=255,
        blank=True,
        default="",
        help_text="Degrees and certifications (e.g., MBBS, MD, DM Cardiology).",
    )
    experience_years = models.PositiveIntegerField(
        default=0,
        help_text="Years of clinical practice experience.",
    )
    bio = models.TextField(
        blank=True,
        default="",
        help_text="Professional biography, clinical interests, and research background.",
    )
    room_number = models.CharField(
        max_length=50,
        blank=True,
        default="",
        help_text="Consultation room / OPD cabin (e.g., OPD Cabin 204).",
    )
    consultation_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text="Outpatient consultation fee in local currency.",
    )
    default_consultation_minutes = models.PositiveIntegerField(
        default=15,
        help_text="Standard consultation slot duration in minutes.",
    )
    max_daily_patients = models.PositiveIntegerField(
        default=40,
        help_text="Maximum total patient consultations permitted per day across all shifts.",
    )
    is_available_for_teleconsult = models.BooleanField(
        default=False,
        help_text="Designates whether clinician accepts virtual consultations.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Active operational status of the clinician in this hospital.",
    )

    class Meta:
        db_table = "doctors"
        verbose_name = "Doctor"
        verbose_name_plural = "Doctors"
        ordering = ["user__last_name", "user__first_name"]

    def __str__(self) -> str:
        return f"Dr. {self.user.full_name} ({self.specialization})"

    @property
    def full_name(self) -> str:
        return f"Dr. {self.user.full_name}"


class DoctorShift(TimeStampedModel):
    """
    Recurring weekly shift schedule defining doctor availability and slot quotas.
    """

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name="shifts",
        help_text="Doctor clinician to whom this shift applies.",
    )
    day_of_week = models.PositiveSmallIntegerField(
        choices=DayOfWeek.choices,
        db_index=True,
        help_text="Day of the week (0=Monday through 6=Sunday).",
    )
    start_time = models.TimeField(
        help_text="Shift start time (e.g., 09:00:00).",
    )
    end_time = models.TimeField(
        help_text="Shift end time (e.g., 13:00:00).",
    )
    slot_duration_minutes = models.PositiveIntegerField(
        default=15,
        help_text="Slot duration for this shift in minutes.",
    )
    max_online_slots = models.PositiveIntegerField(
        default=15,
        help_text="Quota allocated for pre-booked online appointments.",
    )
    max_walkin_slots = models.PositiveIntegerField(
        default=10,
        help_text="Quota allocated for walk-in hospital registrations.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this recurring shift is active.",
    )

    class Meta:
        db_table = "doctor_shifts"
        verbose_name = "Doctor Shift"
        verbose_name_plural = "Doctor Shifts"
        ordering = ["day_of_week", "start_time"]
        constraints = [
            models.UniqueConstraint(
                fields=["doctor", "day_of_week", "start_time"],
                name="unique_doctor_day_shift",
            )
        ]

    def __str__(self) -> str:
        return f"{self.doctor} - {self.get_day_of_week_display()} ({self.start_time.strftime('%H:%M')} - {self.end_time.strftime('%H:%M')})"
