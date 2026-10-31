from datetime import date, time, timedelta
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from apps.accounts.models import User, UserRole
from apps.appointments.models import AppointmentSlot, SlotType
from apps.appointments.services import SlotGenerationService
from apps.departments.models import Department
from apps.doctors.models import DayOfWeek, Doctor, DoctorShift
from apps.hospitals.models import Hospital


class AppointmentSlotsApiTestCase(APITestCase):
    def setUp(self):
        self.hospital = Hospital.objects.create(
            name="Fortis Memorial Research Institute",
            code="FMRI-GGN",
            address_line1="Sector 44",
            city="Gurugram",
            state="Haryana",
            postal_code="122002",
            contact_email="care@fortishealthcare.com",
            contact_phone="+911244921021",
        )

        self.department = Department.objects.create(
            hospital=self.hospital,
            name="Neurology",
            code="NEURO",
            floor_location="Tower A, 4th Floor",
        )

        self.hospital_admin = User.objects.create_user(
            email="admin.fmri@queuefree.io",
            password="HospitalAdminPass123!",
            first_name="Pooja",
            last_name="Aggarwal",
            role=UserRole.HOSPITAL_ADMIN,
            hospital=self.hospital,
        )

        self.doctor_user = User.objects.create_user(
            email="dr.sachdeva@queuefree.io",
            password="DoctorSecurePass123!",
            first_name="Arun",
            last_name="Sachdeva",
            role=UserRole.DOCTOR,
            hospital=self.hospital,
        )
        self.doctor = Doctor.objects.create(
            user=self.doctor_user,
            hospital=self.hospital,
            department=self.department,
            license_number="HN-77889",
            specialization="Senior Neurosurgeon",
            default_consultation_minutes=20,
            max_daily_patients=25,
        )

        # Setup Monday Shift: 09:00 to 11:00 (6 slots of 20 mins)
        self.shift_monday = DoctorShift.objects.create(
            doctor=self.doctor,
            day_of_week=DayOfWeek.MONDAY,
            start_time=time(9, 0),
            end_time=time(11, 0),
            slot_duration_minutes=20,
            max_online_slots=4,
            max_walkin_slots=2,
            is_active=True,
        )

        # Setup Wednesday Shift: 14:00 to 15:00 (3 slots of 20 mins)
        self.shift_wednesday = DoctorShift.objects.create(
            doctor=self.doctor,
            day_of_week=DayOfWeek.WEDNESDAY,
            start_time=time(14, 0),
            end_time=time(15, 0),
            slot_duration_minutes=20,
            max_online_slots=2,
            max_walkin_slots=1,
            is_active=True,
        )

        self.slots_list_url = reverse("appointments:slot_list")
        self.generate_url = reverse("appointments:slot_generate")

    def test_slot_generation_service(self):
        # Pick a Monday date: e.g. 2026-11-02 is Monday, 2026-11-08 is Sunday
        start = date(2026, 11, 2)
        end = date(2026, 11, 8)

        stats = SlotGenerationService.generate_slots_for_doctor(
            doctor=self.doctor,
            start_date=start,
            end_date=end,
        )
        # Monday (09:00 to 11:00 with 20min step) = 6 slots
        # Wednesday (14:00 to 15:00 with 20min step) = 3 slots
        # Total = 9 slots
        self.assertEqual(stats["slots_created"], 9)
        self.assertEqual(stats["dates_processed"], 2)

        # Verify generated slot records
        slots = AppointmentSlot.objects.filter(doctor=self.doctor)
        self.assertEqual(slots.count(), 9)

        # Check Monday slot intervals
        mon_slots = slots.filter(slot_date=start).order_by("start_time")
        self.assertEqual(mon_slots.count(), 6)
        self.assertEqual(mon_slots[0].start_time, time(9, 0))
        self.assertEqual(mon_slots[0].end_time, time(9, 20))
        self.assertEqual(mon_slots[5].start_time, time(10, 40))
        self.assertEqual(mon_slots[5].end_time, time(11, 0))

    def test_generate_slots_api_endpoint(self):
        self.client.force_authenticate(user=self.hospital_admin)
        start = date(2026, 11, 2)
        end = date(2026, 11, 4)  # Monday to Wednesday

        payload = {
            "doctor_id": str(self.doctor.id),
            "start_date": str(start),
            "end_date": str(end),
            "replace_existing_unbooked": False,
        }
        res = self.client.post(self.generate_url, payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["data"]["slots_created"], 9)

    def test_list_available_slots_api(self):
        # First generate slots
        SlotGenerationService.generate_slots_for_doctor(
            doctor=self.doctor,
            start_date=date(2026, 11, 2),
            end_date=date(2026, 11, 2),
        )

        res = self.client.get(
            self.slots_list_url,
            {"doctor_id": str(self.doctor.id), "date": "2026-11-02"},
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 6)
        self.assertEqual(res.data[0]["doctor_name"], "Dr. Arun Sachdeva")
        self.assertFalse(res.data[0]["is_booked"])
        self.assertFalse(res.data[0]["is_blocked"])

    def test_block_and_unblock_slot_api(self):
        SlotGenerationService.generate_slots_for_doctor(
            doctor=self.doctor,
            start_date=date(2026, 11, 2),
            end_date=date(2026, 11, 2),
        )
        slot = AppointmentSlot.objects.filter(doctor=self.doctor).first()

        block_url = reverse("appointments:slot_block_toggle", kwargs={"id": slot.id})

        # Doctor blocks the slot
        self.client.force_authenticate(user=self.doctor_user)
        res = self.client.patch(block_url, {"is_blocked": True}, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        slot.refresh_from_db()
        self.assertTrue(slot.is_blocked)

        # Slot should not appear in available_only list
        list_res = self.client.get(
            self.slots_list_url,
            {"doctor_id": str(self.doctor.id), "date": "2026-11-02", "available_only": "true"},
        )
        self.assertEqual(len(list_res.data), 5)  # 6 - 1 blocked = 5
