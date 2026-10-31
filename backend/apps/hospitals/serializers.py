from rest_framework import serializers
from apps.hospitals.models import Hospital


class HospitalSerializer(serializers.ModelSerializer):
    departments_count = serializers.IntegerField(source="departments.count", read_only=True)
    doctors_count = serializers.IntegerField(source="doctors.count", read_only=True)

    class Meta:
        model = Hospital
        fields = [
            "id",
            "name",
            "code",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "postal_code",
            "country",
            "contact_email",
            "contact_phone",
            "settings",
            "is_active",
            "departments_count",
            "doctors_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class HospitalCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = [
            "id",
            "name",
            "code",
            "address_line1",
            "address_line2",
            "city",
            "state",
            "postal_code",
            "country",
            "contact_email",
            "contact_phone",
            "settings",
            "is_active",
        ]
        read_only_fields = ["id"]

    def validate_code(self, value: str) -> str:
        code = value.upper().strip()
        instance = self.instance
        qs = Hospital.objects.filter(code=code)
        if instance:
            qs = qs.exclude(id=instance.id)
        if qs.exists():
            raise serializers.ValidationError("A hospital with this code already exists.")
        return code
