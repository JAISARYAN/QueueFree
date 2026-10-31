from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.accounts.models import User, UserRole
from apps.departments.models import Department
from apps.hospitals.models import Hospital


class DepartmentsApiTestCase(APITestCase):
    def setUp(self):
        self.hospital = Hospital.objects.create(
            name="Max Super Speciality Hospital",
            code="MAX-SAKET",
            address_line1="1, 2, Press Enclave Road, Saket",
            city="New Delhi",
            state="Delhi",
            postal_code="110017",
            contact_email="care@maxhealthcare.com",
            contact_phone="+911126515050",
        )

        self.other_hospital = Hospital.objects.create(
            name="Medanta The Medicity",
            code="MEDANTA-GGN",
            address_line1="CH Bakhtawar Singh Road, Sector 38",
            city="Gurugram",
            state="Haryana",
            postal_code="122001",
            contact_email="care@medanta.org",
            contact_phone="+911244141414",
        )

        self.hospital_admin = User.objects.create_user(
            email="admin.max@queuefree.io",
            password="HospitalAdminPass123!",
            first_name="Ananya",
            last_name="Roy",
            role=UserRole.HOSPITAL_ADMIN,
            hospital=self.hospital,
        )

        self.department = Department.objects.create(
            hospital=self.hospital,
            name="Department of Cardiology",
            code="CARD",
            floor_location="Tower A, 3rd Floor",
            description="Comprehensive cardiac diagnostics and interventional care.",
            is_active=True,
        )

        self.list_url = reverse("departments:department_list_create")
        self.detail_url = reverse("departments:department_detail", kwargs={"id": self.department.id})

    def test_list_departments(self):
        res = self.client.get(self.list_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)

    def test_filter_departments_by_hospital(self):
        res = self.client.get(self.list_url, {"hospital_id": str(self.hospital.id)})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["code"], "CARD")

        res_other = self.client.get(self.list_url, {"hospital_id": str(self.other_hospital.id)})
        self.assertEqual(res_other.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_other.data), 0)

    def test_hospital_admin_can_create_department(self):
        self.client.force_authenticate(user=self.hospital_admin)
        payload = {
            "hospital": str(self.hospital.id),
            "name": "Orthopedics & Joint Replacement",
            "code": "ORTHO",
            "floor_location": "Tower B, Ground Floor",
            "description": "Joint replacement and sports injury rehabilitation.",
        }
        res = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["code"], "ORTHO")

    def test_duplicate_department_code_within_same_hospital_fails(self):
        self.client.force_authenticate(user=self.hospital_admin)
        payload = {
            "hospital": str(self.hospital.id),
            "name": "Cardiology Preventive Clinic",
            "code": "CARD",  # Duplicate code in same hospital
            "floor_location": "Tower A",
        }
        res = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue("code" in res.data or "non_field_errors" in res.data)

    def test_hospital_admin_cannot_create_for_another_hospital(self):
        self.client.force_authenticate(user=self.hospital_admin)
        payload = {
            "hospital": str(self.other_hospital.id),  # Different hospital!
            "name": "Unauthorized Department",
            "code": "UNAUTH",
        }
        res = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_deactivate_department(self):
        self.client.force_authenticate(user=self.hospital_admin)
        res = self.client.delete(self.detail_url)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.department.refresh_from_db()
        self.assertFalse(self.department.is_active)
