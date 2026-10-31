from typing import Any, Dict
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.accounts.models import User, UserRole


class QueueFreeTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT serializer that embeds identity and role claims
    directly into the generated JWT access token payload.
    """

    @classmethod
    def get_token(cls, user: User):
        token = super().get_token(user)

        # Standard custom claims embedded into JWT access token
        token["email"] = user.email
        token["role"] = user.role
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name
        token["hospital_id"] = str(user.hospital_id) if user.hospital_id else None
        token["is_verified"] = user.is_verified

        return token

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        data = super().validate(attrs)

        # Append structured user profile to initial login response
        user = self.user
        data["user"] = {
            "id": str(user.id),
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,
            "role": user.role,
            "hospital_id": str(user.hospital_id) if user.hospital_id else None,
            "is_verified": user.is_verified,
        }
        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for public patient self-registration.
    Public registration is strictly constrained to the PATIENT role.
    Privileged staff (Doctor, Receptionist, Hospital Admin) cannot self-register.
    """

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        help_text="Password satisfying minimum length and complexity criteria.",
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        help_text="Confirmation password matching the primary password.",
    )

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone_number",
            "password",
            "password_confirm",
        ]
        read_only_fields = ["id"]

    def validate_email(self, value: str) -> str:
        value = value.lower().strip()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return value

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})

        # Run Django password validators
        validate_password(attrs["password"])
        return attrs

    def create(self, validated_data: Dict[str, Any]) -> User:
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")

        # Defense-in-depth: Force PATIENT role regardless of what was passed
        user = User.objects.create_user(
            role=UserRole.PATIENT,
            password=password,
            **validated_data,
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for reading and updating authenticated user profiles.
    Role and hospital associations are strictly read-only.
    """

    role_display = serializers.CharField(source="get_role_display", read_only=True)
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone_number",
            "role",
            "role_display",
            "hospital",
            "is_verified",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "email",
            "role",
            "role_display",
            "hospital",
            "is_verified",
            "created_at",
            "updated_at",
        ]


class LogoutRequestSerializer(serializers.Serializer):
    """
    Serializer validating the refresh token to be blacklisted.
    """
    refresh = serializers.CharField(
        required=True,
        help_text="Valid JWT refresh token to be blacklisted.",
    )


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for authenticated password changes requiring current password verification.
    """

    old_password = serializers.CharField(
        required=True,
        write_only=True,
        style={"input_type": "password"},
    )
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        style={"input_type": "password"},
    )
    new_password_confirm = serializers.CharField(
        required=True,
        write_only=True,
        style={"input_type": "password"},
    )

    def validate_old_password(self, value: str) -> str:
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("The current password provided is incorrect.")
        return value

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        if attrs["new_password"] != attrs["new_password_confirm"]:
            raise serializers.ValidationError(
                {"new_password_confirm": "New passwords do not match."}
            )

        user = self.context["request"].user
        validate_password(attrs["new_password"], user=user)
        return attrs

    def save(self, **kwargs) -> User:
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user
