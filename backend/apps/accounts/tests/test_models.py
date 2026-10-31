import pytest
from django.test import TestCase
from apps.accounts.models import User, UserRole
from apps.hospitals.models import Hospital


class UserModelTestCase(TestCase):
    """
    Unit tests for Custom User model and CustomUserManager.
    """

    def setUp(self):
        self.hospital = Hospital.objects.create(
            name="Test Memorial Hospital",
            code="TMH-001",
            address_line1="123 Health Ave",
            city="New Delhi",
            state="Delhi",
            postal_code="110001",
            contact_email="admin@tmh.org",
            contact_phone="+919876543210",
        )

    def test_create_patient_user(self):
        user = User.objects.create_user(
            email="patient@example.com",
            password="SecurePassword123!",
            first_name="Jane",
            last_name="Doe",
            phone_number="+919876543211",
        )
        self.assertEqual(user.email, "patient@example.com")
        self.assertTrue(user.check_password("SecurePassword123!"))
        self.assertEqual(user.role, UserRole.PATIENT)
        self.assertTrue(user.is_patient)
        self.assertFalse(user.is_doctor)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)
        self.assertEqual(user.full_name, "Jane Doe")

    def test_create_doctor_with_hospital(self):
        doctor = User.objects.create_user(
            email="dr.sharma@example.com",
            password="DoctorSecurePass123!",
            first_name="Ramesh",
            last_name="Sharma",
            role=UserRole.DOCTOR,
            hospital=self.hospital,
        )
        self.assertEqual(doctor.role, UserRole.DOCTOR)
        self.assertTrue(doctor.is_doctor)
        self.assertFalse(doctor.is_patient)
        self.assertEqual(doctor.hospital, self.hospital)

    def test_create_superuser(self):
        admin = User.objects.create_superuser(
            email="superadmin@queuefree.io",
            password="AdminPassword123!",
            first_name="Platform",
            last_name="Admin",
        )
        self.assertEqual(admin.role, UserRole.SUPERADMIN)
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_superadmin)

    def test_create_user_without_email_raises_error(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(
                email="",
                password="SomePassword123!",
                first_name="No",
                last_name="Email",
            )

    def test_email_normalization(self):
        user = User.objects.create_user(
            email="PAtient.Care@EXAMPLE.com",
            password="SecurePassword123!",
            first_name="Test",
            last_name="User",
        )
        self.assertEqual(user.email, "PAtient.Care@example.com")
