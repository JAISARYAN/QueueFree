from django.test import TestCase
from rest_framework.test import APIRequestFactory
from apps.accounts.models import User, UserRole
from apps.accounts.permissions import (
    IsDoctor,
    IsHospitalAdmin,
    IsHospitalStaff,
    IsPatient,
    IsReceptionist,
    IsSuperAdmin,
)


class PermissionsTestCase(TestCase):
    """
    Unit tests for role-based permission classes.
    """

    def setUp(self):
        self.factory = APIRequestFactory()
        self.patient = User.objects.create_user(
            email="patient.perm@example.com",
            password="Password123!",
            first_name="P",
            last_name="U",
            role=UserRole.PATIENT,
        )
        self.doctor = User.objects.create_user(
            email="doctor.perm@example.com",
            password="Password123!",
            first_name="D",
            last_name="U",
            role=UserRole.DOCTOR,
        )
        self.receptionist = User.objects.create_user(
            email="receptionist.perm@example.com",
            password="Password123!",
            first_name="R",
            last_name="U",
            role=UserRole.RECEPTIONIST,
        )
        self.hospital_admin = User.objects.create_user(
            email="hadmin.perm@example.com",
            password="Password123!",
            first_name="H",
            last_name="U",
            role=UserRole.HOSPITAL_ADMIN,
        )
        self.superadmin = User.objects.create_superuser(
            email="sadmin.perm@example.com",
            password="Password123!",
            first_name="S",
            last_name="U",
        )

    def test_is_patient_permission(self):
        perm = IsPatient()
        req = self.factory.get("/")

        req.user = self.patient
        self.assertTrue(perm.has_permission(req, None))

        req.user = self.doctor
        self.assertFalse(perm.has_permission(req, None))

    def test_is_doctor_permission(self):
        perm = IsDoctor()
        req = self.factory.get("/")

        req.user = self.doctor
        self.assertTrue(perm.has_permission(req, None))

        req.user = self.patient
        self.assertFalse(perm.has_permission(req, None))

    def test_is_receptionist_permission(self):
        perm = IsReceptionist()
        req = self.factory.get("/")

        req.user = self.receptionist
        self.assertTrue(perm.has_permission(req, None))

        req.user = self.patient
        self.assertFalse(perm.has_permission(req, None))

    def test_is_hospital_admin_permission(self):
        perm = IsHospitalAdmin()
        req = self.factory.get("/")

        req.user = self.hospital_admin
        self.assertTrue(perm.has_permission(req, None))

        req.user = self.superadmin
        self.assertTrue(perm.has_permission(req, None))

        req.user = self.doctor
        self.assertFalse(perm.has_permission(req, None))

    def test_is_superadmin_permission(self):
        perm = IsSuperAdmin()
        req = self.factory.get("/")

        req.user = self.superadmin
        self.assertTrue(perm.has_permission(req, None))

        req.user = self.hospital_admin
        self.assertFalse(perm.has_permission(req, None))

    def test_is_hospital_staff_permission(self):
        perm = IsHospitalStaff()
        req = self.factory.get("/")

        for staff_user in [self.doctor, self.receptionist, self.hospital_admin]:
            req.user = staff_user
            self.assertTrue(perm.has_permission(req, None))

        req.user = self.patient
        self.assertFalse(perm.has_permission(req, None))
