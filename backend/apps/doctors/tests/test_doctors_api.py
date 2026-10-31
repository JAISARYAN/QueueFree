from datetime import time
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.accounts.models import User, UserRole
from apps.departments.models import Department
from apps.doctors.models import DayOfWeek, Doctor, DoctorShift
from apps.hospitals.models import Hospital


class DoctorsApiTestCase(APITestCase):
    def setUp(self):
        self.hospital = Hospital.objects.create(
            name="Sir Ganga Ram Hospital",
            code="SGRH-DELHI",
            address_line1="Rajinder Nagar",
            city="New Delhi",
            state="Delhi",
            postal_code="110060",
            contact_email="info@sgrh.com",
            contact_phone="+911142254000",
        )

        self.department = Department.objects.create(
            hospital=self.hospital,
            name="General Medicine",
            code="GENMED",
            floor_location="Main Block, 1st Floor",
        )

        self.hospital_admin = User.objects.create_user(
            email="admin.sgrh@queuefree.io",
            password="HospitalAdminPass123!",
            first_name="Vikram",
            last_name="Malhotra",
            role=UserRole.HOSPITAL_ADMIN,
            hospital=self.hospital,
        )

        # Existing Doctor
        self.doctor_user = User.objects.create_user(
            email="dr.gupta@queuefree.io",
            password="DoctorSecurePass123!",
            first_name="Suresh",
            last_name="Gupta",
            role=UserRole.DOCTOR,
            hospital=self.hospital,
        )
        self.doctor = Doctor.objects.create(
            user=self.doctor_user,
            hospital=self.hospital,
            department=self.department,
            license_number="DMC-19882",
            specialization="Senior Consultant Physician",
            qualifications="MBBS, MD (Medicine)",
            experience_years=18,
            room_number="Cabin 102",
            consultation_fee=1200.00,
            default_consultation_minutes=15,
            max_daily_patients=40,
        )

        self.list_url = reverse("doctors:doctor_list_create")
        self.detail_url = reverse("doctors:doctor_detail", kwargs={"id": self.doctor.id})
        self.shifts_url = reverse("doctors:doctor_shift_list_create", kwargs={"doctor_id": self.doctor.id})

    def test_list_doctors(self):
        res = self.client.get(self.list_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["license_number"], "DMC-19882")

    def test_onboard_new_doctor(self):
        self.client.force_authenticate(user=self.hospital_admin)
        payload = {
            "email": "dr.kapoor@queuefree.io",
            "first_name": "Meera",
            "last_name": "Kapoor",
            "phone_number": "+919811223344",
            "hospital": str(self.hospital.id),
            "department": str(self.department.id),
            "license_number": "DMC-44556",
            "specialization": "Clinical Hematologist",
            "qualifications": "MBBS, MD, DM Clinical Hematology",
            "experience_years": 12,
            "room_number": "Cabin 108",
            "consultation_fee": 1500.00,
            "default_consultation_minutes": 20,
            "max_daily_patients": 30,
        }
        res = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["license_number"], "DMC-44556")

        # Verify provisioned User account
        created_user = User.objects.get(email="dr.kapoor@queuefree.io")
        self.assertEqual(created_user.role, UserRole.DOCTOR)
        self.assertEqual(created_user.hospital, self.hospital)

    def test_duplicate_license_number_fails(self):
        self.client.force_authenticate(user=self.hospital_admin)
        payload = {
            "email": "dr.duplicate@queuefree.io",
            "first_name": "Duplicate",
            "last_name": "Doc",
            "hospital": str(self.hospital.id),
            "department": str(self.department.id),
            "license_number": "DMC-19882",  # Already exists!
            "specialization": "Physician",
        }
        res = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("license_number", res.data)

    def test_doctor_can_update_own_profile(self):
        self.client.force_authenticate(user=self.doctor_user)
        patch_payload = {
            "room_number": "Cabin 105-Renovated",
            "consultation_fee": 1400.00,
        }
        res = self.client.patch(self.detail_url, patch_payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.doctor.refresh_from_db()
        self.assertEqual(self.doctor.room_number, "Cabin 105-Renovated")
        self.assertEqual(float(self.doctor.consultation_fee), 1400.00)

    def test_add_doctor_weekly_shift(self):
        self.client.force_authenticate(user=self.hospital_admin)
        shift_payload = {
            "day_of_week": DayOfWeek.MONDAY,
            "start_time": "09:00:00",
            "end_time": "13:00:00",
            "slot_duration_minutes": 15,
            "max_online_slots": 12,
            "max_walkin_slots": 4,
        }
        res = self.client.post(self.shifts_url, shift_payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["day_of_week"], DayOfWeek.MONDAY)

        # Verify listed shift
        list_res = self.client.get(self.shifts_url)
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_res.data), 1)
