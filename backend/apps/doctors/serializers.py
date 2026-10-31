from django.db import transaction
from rest_framework import serializers
from apps.accounts.models import User, UserRole
from apps.departments.models import Department
from apps.doctors.models import DayOfWeek, Doctor, DoctorShift
from apps.hospitals.models import Hospital


class DoctorShiftSerializer(serializers.ModelSerializer):
    day_of_week_display = serializers.CharField(source="get_day_of_week_display", read_only=True)

    class Meta:
        model = DoctorShift
        fields = [
            "id",
            "doctor",
            "day_of_week",
            "day_of_week_display",
            "start_time",
            "end_time",
            "slot_duration_minutes",
            "max_online_slots",
            "max_walkin_slots",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "doctor", "created_at", "updated_at"]

    def validate(self, attrs):
        start_time = attrs.get("start_time") or (self.instance.start_time if self.instance else None)
        end_time = attrs.get("end_time") or (self.instance.end_time if self.instance else None)
        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError({"end_time": "Shift end time must be after start time."})
        return attrs


class DoctorSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    phone_number = serializers.CharField(source="user.phone_number", read_only=True)
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)
    hospital_name = serializers.CharField(source="hospital.name", read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)
    shifts = DoctorShiftSerializer(many=True, read_only=True)

    class Meta:
        model = Doctor
        fields = [
            "id",
            "user",
            "email",
            "phone_number",
            "first_name",
            "last_name",
            "full_name",
            "hospital",
            "hospital_name",
            "department",
            "department_name",
            "license_number",
            "specialization",
            "qualifications",
            "experience_years",
            "bio",
            "room_number",
            "consultation_fee",
            "default_consultation_minutes",
            "max_daily_patients",
            "is_available_for_teleconsult",
            "is_active",
            "shifts",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]


class DoctorCreateSerializer(serializers.ModelSerializer):
    """
    Onboards a new Doctor clinician.
    Atomically provisions their accounts.User record (with DOCTOR role)
    and binds their Doctor profile to the designated hospital and department.
    """

    email = serializers.EmailField(write_only=True, required=True)
    first_name = serializers.CharField(write_only=True, max_length=100, required=True)
    last_name = serializers.CharField(write_only=True, max_length=100, required=True)
    phone_number = serializers.CharField(write_only=True, max_length=20, required=False, default="")
    password = serializers.CharField(write_only=True, required=False, default="DoctorWelcome@2026")

    class Meta:
        model = Doctor
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "password",
            "hospital",
            "department",
            "license_number",
            "specialization",
            "qualifications",
            "experience_years",
            "bio",
            "room_number",
            "consultation_fee",
            "default_consultation_minutes",
            "max_daily_patients",
            "is_available_for_teleconsult",
            "is_active",
        ]
        read_only_fields = ["id"]

    def validate_email(self, value: str) -> str:
        value = value.lower().strip()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return value

    def validate_license_number(self, value: str) -> str:
        value = value.upper().strip()
        if Doctor.objects.filter(license_number=value).exists():
            raise serializers.ValidationError("A doctor with this medical license number already exists.")
        return value

    def validate(self, attrs):
        hospital = attrs.get("hospital")
        department = attrs.get("department")

        if hospital and department and department.hospital_id != hospital.id:
            raise serializers.ValidationError(
                {"department": "The selected clinical department does not belong to this hospital facility."}
            )
        return attrs

    def create(self, validated_data) -> Doctor:
        email = validated_data.pop("email")
        first_name = validated_data.pop("first_name")
        last_name = validated_data.pop("last_name")
        phone_number = validated_data.pop("phone_number", "")
        password = validated_data.pop("password")
        hospital = validated_data["hospital"]

        with transaction.atomic():
            user = User.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                phone_number=phone_number,
                role=UserRole.DOCTOR,
                hospital=hospital,
                is_verified=True,
            )
            doctor = Doctor.objects.create(user=user, **validated_data)
        return doctor


class DoctorUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = [
            "department",
            "specialization",
            "qualifications",
            "experience_years",
            "bio",
            "room_number",
            "consultation_fee",
            "default_consultation_minutes",
            "max_daily_patients",
            "is_available_for_teleconsult",
            "is_active",
        ]
