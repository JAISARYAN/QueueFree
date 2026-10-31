from rest_framework import serializers
from apps.appointments.models import AppointmentSlot, SlotType
from apps.doctors.models import Doctor


class AppointmentSlotSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source="doctor.full_name", read_only=True)
    specialization = serializers.CharField(source="doctor.specialization", read_only=True)
    department_name = serializers.CharField(source="doctor.department.name", read_only=True)
    hospital_name = serializers.CharField(source="hospital.name", read_only=True)

    class Meta:
        model = AppointmentSlot
        fields = [
            "id",
            "doctor",
            "doctor_name",
            "specialization",
            "department_name",
            "hospital",
            "hospital_name",
            "slot_date",
            "start_time",
            "end_time",
            "slot_type",
            "is_booked",
            "is_blocked",
            "version",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_booked", "version", "created_at", "updated_at"]


class SlotGenerationRequestSerializer(serializers.Serializer):
    doctor_id = serializers.UUIDField(required=True, help_text="Target doctor UUID.")
    start_date = serializers.DateField(required=True, help_text="Start date for slot generation (YYYY-MM-DD).")
    end_date = serializers.DateField(required=True, help_text="End date for slot generation (YYYY-MM-DD).")
    replace_existing_unbooked = serializers.BooleanField(
        required=False,
        default=False,
        help_text="Whether to wipe and replace unbooked slots in the target date range.",
    )

    def validate(self, attrs):
        if attrs["start_date"] > attrs["end_date"]:
            raise serializers.ValidationError({"end_date": "End date must be greater than or equal to start date."})
        return attrs


class SlotBlockToggleSerializer(serializers.Serializer):
    is_blocked = serializers.BooleanField(
        required=True,
        help_text="Set to true to block the slot, false to unblock.",
    )
