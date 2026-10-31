from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from apps.core.models import TimeStampedModel


class UserRole(models.TextChoices):
    PATIENT = "PATIENT", "Patient"
    DOCTOR = "DOCTOR", "Doctor"
    RECEPTIONIST = "RECEPTIONIST", "Receptionist"
    HOSPITAL_ADMIN = "HOSPITAL_ADMIN", "Hospital Admin"
    SUPERADMIN = "SUPERADMIN", "Platform Superadmin"


class CustomUserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifier
    for authentication instead of usernames.
    """

    def create_user(self, email: str, password: str | None = None, **extra_fields):
        if not email:
            raise ValueError("An email address must be provided.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: str | None = None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", UserRole.SUPERADMIN)
        extra_fields.setdefault("is_verified", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    """
    QueueFree Unified User Model.
    All platform actors (patients, doctors, receptionists, hospital administrators,
    and platform superadmins) authenticate through this model with role-based policies.
    """

    email = models.EmailField(
        max_length=255,
        unique=True,
        db_index=True,
        help_text="Primary email address used for login, notifications, and identity verification.",
    )
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        db_index=True,
        help_text="Phone number in E.164 format for SMS and WhatsApp token alerts.",
    )
    first_name = models.CharField(
        max_length=100,
        help_text="Given name.",
    )
    last_name = models.CharField(
        max_length=100,
        help_text="Family or surname.",
    )
    role = models.CharField(
        max_length=30,
        choices=UserRole.choices,
        default=UserRole.PATIENT,
        db_index=True,
        help_text="Primary platform role governing system privileges and layout authorization.",
    )
    hospital = models.ForeignKey(
        "hospitals.Hospital",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="staff_members",
        help_text="Hospital facility assignment (required for staff; NULL for Patients and Superadmins).",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Designates whether this user account should be treated as active.",
    )
    is_staff = models.BooleanField(
        default=False,
        help_text="Designates whether the user can log into the Django admin site.",
    )
    is_verified = models.BooleanField(
        default=False,
        help_text="Designates whether email or identity has undergone two-factor or administrative verification.",
    )
    date_joined = models.DateTimeField(
        default=timezone.now,
        help_text="Timestamp when the user account was initially registered.",
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    class Meta:
        db_table = "users"
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["email"], name="idx_users_email"),
            models.Index(fields=["role"], name="idx_users_role"),
            models.Index(fields=["phone_number"], name="idx_users_phone"),
        ]

    def __str__(self) -> str:
        return f"{self.email} ({self.get_role_display()})"

    @property
    def full_name(self) -> str:
        name = f"{self.first_name} {self.last_name}".strip()
        return name if name else self.email

    @property
    def is_patient(self) -> bool:
        return self.role == UserRole.PATIENT

    @property
    def is_doctor(self) -> bool:
        return self.role == UserRole.DOCTOR

    @property
    def is_receptionist(self) -> bool:
        return self.role == UserRole.RECEPTIONIST

    @property
    def is_hospital_admin(self) -> bool:
        return self.role == UserRole.HOSPITAL_ADMIN

    @property
    def is_superadmin(self) -> bool:
        return self.role == UserRole.SUPERADMIN or self.is_superuser
