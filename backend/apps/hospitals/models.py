from django.db import models
from apps.core.models import TimeStampedModel


class Hospital(TimeStampedModel):
    """
    Hospital tenant entity representing healthcare facilities onboarded onto QueueFree.
    """
    name = models.CharField(
        max_length=255,
        db_index=True,
        help_text="Official legal or brand name of the healthcare facility.",
    )
    code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        help_text="Unique slug or alphanumeric identifier for this hospital (e.g., 'APOLLO-DELHI').",
    )
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True, default="")
    city = models.CharField(max_length=100, db_index=True)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=50, default="India")

    contact_email = models.EmailField(max_length=255)
    contact_phone = models.CharField(max_length=20)

    settings = models.JSONField(
        default=dict,
        blank=True,
        help_text="Configurable operational rules (buffer times, grace periods, walk-in thresholds).",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Operational status of the hospital facility.",
    )

    class Meta:
        db_table = "hospitals"
        verbose_name = "Hospital"
        verbose_name_plural = "Hospitals"
        ordering = ["name"]

    def __str__(self) -> str:
        return f"{self.name} ({self.code})"
