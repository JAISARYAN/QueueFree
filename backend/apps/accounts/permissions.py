from rest_framework.permissions import BasePermission
from apps.accounts.models import UserRole


class IsPatient(BasePermission):
    """
    Allows access only to authenticated users with the PATIENT role.
    """
    message = "Patient privileges are required to access this resource."

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.PATIENT
        )


class IsDoctor(BasePermission):
    """
    Allows access only to authenticated users with the DOCTOR role.
    """
    message = "Doctor privileges are required to access this resource."

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.DOCTOR
        )


class IsReceptionist(BasePermission):
    """
    Allows access only to authenticated users with the RECEPTIONIST role.
    """
    message = "Receptionist privileges are required to access this resource."

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == UserRole.RECEPTIONIST
        )


class IsHospitalAdmin(BasePermission):
    """
    Allows access only to authenticated users with the HOSPITAL_ADMIN role
    or superadmins.
    """
    message = "Hospital Administrator privileges are required to access this resource."

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                request.user.role == UserRole.HOSPITAL_ADMIN
                or request.user.role == UserRole.SUPERADMIN
                or request.user.is_superuser
            )
        )


class IsSuperAdmin(BasePermission):
    """
    Allows access only to platform superadministrators.
    """
    message = "Platform Superadministrator privileges are required."

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == UserRole.SUPERADMIN or request.user.is_superuser)
        )


class IsHospitalStaff(BasePermission):
    """
    Allows access to clinical or administrative staff affiliated with a hospital
    (Doctors, Receptionists, and Hospital Administrators).
    """
    message = "Hospital staff affiliation is required to access this resource."

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                request.user.role in [
                    UserRole.DOCTOR,
                    UserRole.RECEPTIONIST,
                    UserRole.HOSPITAL_ADMIN,
                ]
                or request.user.is_superuser
            )
        )
