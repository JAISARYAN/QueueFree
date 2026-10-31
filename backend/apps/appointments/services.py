from datetime import date, datetime, time, timedelta
from typing import Dict, List, Optional
from django.db import transaction
from apps.appointments.models import AppointmentSlot, SlotType
from apps.doctors.models import Doctor, DoctorShift


class SlotGenerationService:
    """
    Intelligent consultation slot generation engine.
    Translates recurring weekly doctor shift schedules into atomic calendar slots.
    """

    @classmethod
    def generate_slots_for_doctor(
        cls,
        doctor: Doctor,
        start_date: date,
        end_date: date,
        replace_existing_unbooked: bool = False,
    ) -> Dict[str, int]:
        """
        Generates appointment slots for a specific doctor between start_date and end_date (inclusive).
        """
        if start_date > end_date:
            raise ValueError("start_date cannot be after end_date.")

        active_shifts = list(doctor.shifts.filter(is_active=True))
        if not active_shifts:
            return {"slots_created": 0, "slots_skipped": 0, "dates_processed": 0}

        # Index shifts by day_of_week (0=Monday, 6=Sunday)
        shifts_by_day: Dict[int, List[DoctorShift]] = {}
        for shift in active_shifts:
            shifts_by_day.setdefault(shift.day_of_week, []).append(shift)

        total_created = 0
        total_skipped = 0
        dates_processed = 0

        current_date = start_date
        while current_date <= end_date:
            weekday = current_date.weekday()
            day_shifts = shifts_by_day.get(weekday, [])

            if day_shifts:
                dates_processed += 1
                for shift in day_shifts:
                    created, skipped = cls._generate_shift_slots(
                        doctor=doctor,
                        shift=shift,
                        target_date=current_date,
                        replace_existing_unbooked=replace_existing_unbooked,
                    )
                    total_created += created
                    total_skipped += skipped

            current_date += timedelta(days=1)

        return {
            "slots_created": total_created,
            "slots_skipped": total_skipped,
            "dates_processed": dates_processed,
        }

    @classmethod
    def _generate_shift_slots(
        cls,
        doctor: Doctor,
        shift: DoctorShift,
        target_date: date,
        replace_existing_unbooked: bool,
    ) -> tuple[int, int]:
        """
        Generates individual slots for one shift on one specific date.
        """
        # Build datetime boundaries for math
        dummy_date = date(2000, 1, 1)
        shift_dt_start = datetime.combine(dummy_date, shift.start_time)
        shift_dt_end = datetime.combine(dummy_date, shift.end_time)
        step = timedelta(minutes=shift.slot_duration_minutes)

        if shift_dt_start >= shift_dt_end:
            return 0, 0

        # Query existing slots for this doctor on target date
        existing_slots = {
            s.start_time: s
            for s in AppointmentSlot.objects.filter(doctor=doctor, slot_date=target_date)
        }

        if replace_existing_unbooked:
            # Delete unbooked slots for this window
            AppointmentSlot.objects.filter(
                doctor=doctor,
                slot_date=target_date,
                start_time__gte=shift.start_time,
                start_time__lt=shift.end_time,
                is_booked=False,
            ).delete()
            # Refresh local existing slots
            existing_slots = {
                s.start_time: s
                for s in AppointmentSlot.objects.filter(doctor=doctor, slot_date=target_date)
            }

        slots_to_create: List[AppointmentSlot] = []
        skipped = 0

        curr_dt = shift_dt_start
        online_quota = shift.max_online_slots
        walkin_quota = shift.max_walkin_slots
        online_count = 0
        walkin_count = 0

        while curr_dt + step <= shift_dt_end:
            t_start = curr_dt.time()
            t_end = (curr_dt + step).time()

            if t_start in existing_slots:
                skipped += 1
            else:
                # Determine slot type based on configured quota interleaving
                # Default policy: alternate 2 online to 1 walkin buffer until quotas exhausted
                if (online_count < online_quota and (online_count <= walkin_count * 2 or walkin_count >= walkin_quota)):
                    slot_type = SlotType.ONLINE
                    online_count += 1
                elif walkin_count < walkin_quota:
                    slot_type = SlotType.WALKIN_BUFFER
                    walkin_count += 1
                else:
                    slot_type = SlotType.ONLINE

                slots_to_create.append(
                    AppointmentSlot(
                        doctor=doctor,
                        hospital=doctor.hospital,
                        slot_date=target_date,
                        start_time=t_start,
                        end_time=t_end,
                        slot_type=slot_type,
                        is_booked=False,
                        is_blocked=False,
                    )
                )

            curr_dt += step

        if slots_to_create:
            with transaction.atomic():
                AppointmentSlot.objects.bulk_create(slots_to_create, ignore_conflicts=True)

        return len(slots_to_create), skipped
