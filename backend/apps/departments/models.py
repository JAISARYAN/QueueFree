from django.db import models
from apps.core.models import TimeStampedModel


class Department(TimeStampedModel):
    """
    Clinical specialty department or outpatient unit within a hospital facility
    (e.g., Cardiology, General Medicine, Pediatrics, Orthopedics).
    """

    hospital = models.ForeignKey(
        "hospitals.Hospital",
        on_delete=models.CASCADE,
        related_name="departments",
        help_text="Hospital facility housing this clinical department.",
    )
    name = models.CharField(
        max_length=150,
        db_index=True,
        help_text="Official clinical department name (e.g., Cardiology, General Medicine).",
    )
    code = models.CharField(
        max_length=50,
        db_index=True,
        help_text="Department short code / token prefix (e.g., CARD, ORTHO, PED).",
    )
    floor_location = models.CharField(
        max_length=100,
        blank=True,
        default="",
        help_text="Physical floor or wing in the facility (e.g., '2nd Floor, Wing B').",
    )
    description = models.TextField(
        blank=True,
        default="",
        help_text="Clinical specialty overview and patient advisory details.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Active operational status of the department.",
    )

    class Meta:
        db_table = "departments"
        verbose_name = "Department"
        verbose_name_plural = "Departments"
        ordering = ["hospital", "name"]
        constraints = [
            models.UniqueConstraint(
                fields=["hospital", "code"],
                name="unique_hospital_department_code",
            )
        ]

    def __str__(self) -> str:
        return f"{self.name} ({self.code}) - {self.hospital.name}"
