from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.accounts.models import User, UserRole
from apps.hospitals.models import Hospital


class HospitalsApiTestCase(APITestCase):
    def setUp(self):
        self.superadmin = User.objects.create_superuser(
            email="sadmin@queuefree.io",
            password="AdminPassword123!",
            first_name="Platform",
            last_name="SuperAdmin",
        )

        self.hospital = Hospital.objects.create(
            name="Apollo Indraprastha Hospital",
            code="APOLLO-DELHI",
            address_line1="Sarita Vihar, Delhi Mathura Road",
            city="New Delhi",
            state="Delhi",
            postal_code="110076",
            country="India",
            contact_email="care@apollo.delhi.org",
            contact_phone="+911126925858",
            is_active=True,
        )

        self.hospital_admin = User.objects.create_user(
            email="admin.apollo@queuefree.io",
            password="HospitalAdminPass123!",
            first_name="Rajesh",
            last_name="Bhatia",
            role=UserRole.HOSPITAL_ADMIN,
            hospital=self.hospital,
        )

        self.patient = User.objects.create_user(
            email="patient.user@example.com",
            password="PatientPassword123!",
            first_name="Kavita",
            last_name="Singh",
            role=UserRole.PATIENT,
        )

        self.list_url = reverse("hospitals:hospital_list_create")
        self.detail_url = reverse("hospitals:hospital_detail", kwargs={"id": self.hospital.id})

    def test_list_hospitals_public(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_filter_hospitals_by_city(self):
        res = self.client.get(self.list_url, {"city": "New Delhi"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        self.assertEqual(res.data[0]["code"], "APOLLO-DELHI")

        res_empty = self.client.get(self.list_url, {"city": "NonExistentCity"})
        self.assertEqual(res_empty.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res_empty.data), 0)

    def test_superadmin_can_create_hospital(self):
        self.client.force_authenticate(user=self.superadmin)
        payload = {
            "name": "Fortis Escorts Heart Institute",
            "code": "FORTIS-OKHLA",
            "address_line1": "Okhla Road",
            "city": "New Delhi",
            "state": "Delhi",
            "postal_code": "110025",
            "country": "India",
            "contact_email": "care@fortis.org",
            "contact_phone": "+911147135000",
            "settings": {"opd_start": "08:30"},
        }
        res = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["code"], "FORTIS-OKHLA")

    def test_hospital_admin_cannot_create_hospital(self):
        self.client.force_authenticate(user=self.hospital_admin)
        payload = {"name": "Unauthorized Hospital", "code": "UNAUTH-01"}
        res = self.client.post(self.list_url, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_hospital_admin_can_update_own_hospital(self):
        self.client.force_authenticate(user=self.hospital_admin)
        patch_payload = {
            "contact_phone": "+911199999999",
            "settings": {"grace_period_minutes": 20},
        }
        res = self.client.patch(self.detail_url, patch_payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.hospital.refresh_from_db()
        self.assertEqual(self.hospital.contact_phone, "+911199999999")
        self.assertEqual(self.hospital.settings.get("grace_period_minutes"), 20)

    def test_patient_cannot_update_hospital(self):
        self.client.force_authenticate(user=self.patient)
        patch_payload = {"name": "Hacked Hospital"}
        res = self.client.patch(self.detail_url, patch_payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)
