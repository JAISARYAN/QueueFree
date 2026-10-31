from rest_framework import serializers
from apps.departments.models import Department
from apps.hospitals.models import Hospital


class DepartmentSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source="hospital.name", read_only=True)
    doctors_count = serializers.IntegerField(source="doctors.count", read_only=True)

    class Meta:
        model = Department
        fields = [
            "id",
            "hospital",
            "hospital_name",
            "name",
            "code",
            "floor_location",
            "description",
            "is_active",
            "doctors_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate_code(self, value: str) -> str:
        return value.upper().strip()

    def validate(self, attrs):
        hospital = attrs.get("hospital") or (self.instance.hospital if self.instance else None)
        code = attrs.get("code") or (self.instance.code if self.instance else None)

        if hospital and code:
            code = code.upper().strip()
            qs = Department.objects.filter(hospital=hospital, code=code)
            if self.instance:
                qs = qs.exclude(id=self.instance.id)
            if qs.exists():
                raise serializers.ValidationError(
                    {"code": f"A department with code '{code}' already exists in this hospital."}
                )
        return attrs
