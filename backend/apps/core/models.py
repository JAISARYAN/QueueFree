import uuid
from django.db import models


class TimeStampedModel(models.Model):
    """
    Abstract base model providing self-updating
    created_at and updated_at timestamp fields, along with UUID primary key.
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Globally unique entity identifier (UUIDv4).",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="Timestamp when this record was created (UTC).",
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when this record was last modified (UTC).",
    )

    class Meta:
        abstract = True
