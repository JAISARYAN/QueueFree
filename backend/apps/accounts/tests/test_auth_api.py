from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.accounts.models import User, UserRole


class AuthApiTestCase(APITestCase):
    """
    Integration tests for Authentication API endpoints:
    registration, login, JWT refresh, logout, profile, and password update.
    """

    def setUp(self):
        self.register_url = reverse("auth:register")
        self.login_url = reverse("auth:login")
        self.refresh_url = reverse("auth:token_refresh")
        self.logout_url = reverse("auth:logout")
        self.me_url = reverse("auth:me")
        self.change_password_url = reverse("auth:change_password")

        # Existing test patient
        self.patient_password = "StrongPassword#2026"
        self.patient = User.objects.create_user(
            email="existing.patient@example.com",
            password=self.patient_password,
            first_name="Aarav",
            last_name="Patel",
            phone_number="+919123456789",
            role=UserRole.PATIENT,
        )

    def test_register_patient_success(self):
        payload = {
            "email": "new.patient@example.com",
            "password": "Password123@#$",
            "password_confirm": "Password123@#$",
            "first_name": "Priya",
            "last_name": "Nair",
            "phone_number": "+919876543210",
        }
        response = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("tokens", response.data)
        self.assertIn("access", response.data["tokens"])
        self.assertIn("refresh", response.data["tokens"])
        self.assertEqual(response.data["user"]["email"], "new.patient@example.com")
        self.assertEqual(response.data["user"]["role"], UserRole.PATIENT)

        # Verify persisted user
        created_user = User.objects.get(email="new.patient@example.com")
        self.assertEqual(created_user.role, UserRole.PATIENT)
        self.assertTrue(created_user.check_password("Password123@#$"))

    def test_register_role_tampering_is_prevented(self):
        # Attempting to self-register as SUPERADMIN or DOCTOR must fail to grant elevated role
        payload = {
            "email": "hacker@example.com",
            "password": "Password123@#$",
            "password_confirm": "Password123@#$",
            "first_name": "Malicious",
            "last_name": "Actor",
            "role": "SUPERADMIN",
        }
        response = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_user = User.objects.get(email="hacker@example.com")
        self.assertEqual(created_user.role, UserRole.PATIENT)
        self.assertFalse(created_user.is_staff)
        self.assertFalse(created_user.is_superuser)

    def test_register_duplicate_email_fails(self):
        payload = {
            "email": "existing.patient@example.com",
            "password": "Password123@#$",
            "password_confirm": "Password123@#$",
            "first_name": "Duplicate",
            "last_name": "User",
        }
        response = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_register_password_mismatch_fails(self):
        payload = {
            "email": "mismatch@example.com",
            "password": "Password123@#$",
            "password_confirm": "DifferentPassword#999",
            "first_name": "Mismatch",
            "last_name": "User",
        }
        response = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password_confirm", response.data)

    def test_login_success(self):
        payload = {
            "email": self.patient.email,
            "password": self.patient_password,
        }
        response = self.client.post(self.login_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertIn("user", response.data)
        self.assertEqual(response.data["user"]["email"], self.patient.email)
        self.assertEqual(response.data["user"]["role"], UserRole.PATIENT)

    def test_login_invalid_password(self):
        payload = {
            "email": self.patient.email,
            "password": "WrongPassword999!",
        }
        response = self.client.post(self.login_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh(self):
        login_res = self.client.post(
            self.login_url,
            {"email": self.patient.email, "password": self.patient_password},
            format="json",
        )
        refresh_token = login_res.data["refresh"]

        refresh_res = self.client.post(
            self.refresh_url,
            {"refresh": refresh_token},
            format="json",
        )
        self.assertEqual(refresh_res.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh_res.data)

    def test_current_user_me_authenticated(self):
        login_res = self.client.post(
            self.login_url,
            {"email": self.patient.email, "password": self.patient_password},
            format="json",
        )
        access_token = login_res.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        me_res = self.client.get(self.me_url)
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.data["email"], self.patient.email)
        self.assertEqual(me_res.data["first_name"], "Aarav")
        self.assertEqual(me_res.data["role"], UserRole.PATIENT)

    def test_current_user_me_unauthenticated_fails(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_profile(self):
        login_res = self.client.post(
            self.login_url,
            {"email": self.patient.email, "password": self.patient_password},
            format="json",
        )
        access_token = login_res.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        update_payload = {
            "first_name": "Aarav-Updated",
            "phone_number": "+919999988888",
            "role": "SUPERADMIN",  # Should be ignored/read-only
        }
        res = self.client.patch(self.me_url, update_payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["first_name"], "Aarav-Updated")
        self.assertEqual(res.data["phone_number"], "+919999988888")
        self.assertEqual(res.data["role"], UserRole.PATIENT)  # Role preserved

        self.patient.refresh_from_db()
        self.assertEqual(self.patient.first_name, "Aarav-Updated")
        self.assertEqual(self.patient.role, UserRole.PATIENT)

    def test_logout_blacklists_refresh_token(self):
        login_res = self.client.post(
            self.login_url,
            {"email": self.patient.email, "password": self.patient_password},
            format="json",
        )
        access_token = login_res.data["access"]
        refresh_token = login_res.data["refresh"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        logout_res = self.client.post(
            self.logout_url,
            {"refresh": refresh_token},
            format="json",
        )
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)

        # Subsequent attempt to refresh using blacklisted token must fail
        refresh_res = self.client.post(
            self.refresh_url,
            {"refresh": refresh_token},
            format="json",
        )
        self.assertEqual(refresh_res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_change_password(self):
        login_res = self.client.post(
            self.login_url,
            {"email": self.patient.email, "password": self.patient_password},
            format="json",
        )
        access_token = login_res.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        new_password = "BrandNewSecurePassword#2026"
        res = self.client.post(
            self.change_password_url,
            {
                "old_password": self.patient_password,
                "new_password": new_password,
                "new_password_confirm": new_password,
            },
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Old password should now fail
        fail_res = self.client.post(
            self.login_url,
            {"email": self.patient.email, "password": self.patient_password},
            format="json",
        )
        self.assertEqual(fail_res.status_code, status.HTTP_401_UNAUTHORIZED)

        # New password succeeds
        pass_res = self.client.post(
            self.login_url,
            {"email": self.patient.email, "password": new_password},
            format="json",
        )
        self.assertEqual(pass_res.status_code, status.HTTP_200_OK)
