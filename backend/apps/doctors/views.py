from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from apps.accounts.models import UserRole
from apps.doctors.models import Doctor, DoctorShift
from apps.doctors.serializers import (
    DoctorCreateSerializer,
    DoctorSerializer,
    DoctorShiftSerializer,
    DoctorUpdateSerializer,
)


class DoctorListCreateView(generics.ListCreateAPIView):
    """
    List doctors (filtered by hospital, department, or search keywords)
    or onboard a new clinician profile.
    """

    queryset = (
        Doctor.objects.filter(is_active=True)
        .select_related("user", "hospital", "department")
        .prefetch_related("shifts")
    )

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return DoctorCreateSerializer
        return DoctorSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        hospital_id = self.request.query_params.get("hospital_id")
        department_id = self.request.query_params.get("department_id")
        search = self.request.query_params.get("search")

        if hospital_id:
            qs = qs.filter(hospital_id=hospital_id)
        if department_id:
            qs = qs.filter(department_id=department_id)
        if search:
            qs = (
                qs.filter(user__first_name__icontains=search.strip())
                | qs.filter(user__last_name__icontains=search.strip())
                | qs.filter(specialization__icontains=search.strip())
                | qs.filter(license_number__icontains=search.strip())
            )
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        target_hospital = serializer.validated_data.get("hospital")

        # Authorization: Superadmin or Hospital Admin of this hospital
        is_assigned_admin = (
            user.role == UserRole.HOSPITAL_ADMIN
            and user.hospital_id == target_hospital.id
        )
        if not (user.role == UserRole.SUPERADMIN or user.is_superuser or is_assigned_admin):
            raise PermissionDenied("You can only onboard doctors for your assigned hospital.")

        serializer.save()

    @extend_schema(
        tags=["Doctors & Shifts"],
        summary="List active doctors",
        parameters=[
            OpenApiParameter(name="hospital_id", description="Filter by hospital UUID", required=False, type=str),
            OpenApiParameter(name="department_id", description="Filter by department UUID", required=False, type=str),
            OpenApiParameter(name="search", description="Search by name, specialization, or license", required=False, type=str),
        ],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        tags=["Doctors & Shifts"],
        summary="Onboard new doctor clinician (Hospital Admin or Superadmin)",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class DoctorDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update a doctor profile.
    """

    queryset = (
        Doctor.objects.all()
        .select_related("user", "hospital", "department")
        .prefetch_related("shifts")
    )
    lookup_field = "id"

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH"]:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return DoctorUpdateSerializer
        return DoctorSerializer

    def perform_update(self, serializer):
        user = self.request.user
        doctor = self.get_object()

        # Authorization check: Doctor themselves, Hospital Admin, or Superadmin
        is_self = user.id == doctor.user_id
        is_assigned_admin = (
            user.role == UserRole.HOSPITAL_ADMIN
            and user.hospital_id == doctor.hospital_id
        )
        if not (user.role == UserRole.SUPERADMIN or user.is_superuser or is_assigned_admin or is_self):
            raise PermissionDenied("You do not have permission to modify this doctor profile.")

        serializer.save()

    @extend_schema(tags=["Doctors & Shifts"], summary="Retrieve doctor profile details and shifts")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(tags=["Doctors & Shifts"], summary="Update doctor profile details")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @extend_schema(tags=["Doctors & Shifts"], summary="Update doctor profile details (full)")
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)


class DoctorShiftListCreateView(generics.ListCreateAPIView):
    """
    List shifts for a doctor or add a new recurring weekly shift.
    """

    serializer_class = DoctorShiftSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        doctor_id = self.kwargs.get("doctor_id")
        return DoctorShift.objects.filter(doctor_id=doctor_id, is_active=True)

    def perform_create(self, serializer):
        user = self.request.user
        doctor_id = self.kwargs.get("doctor_id")
        doctor = generics.get_object_or_404(Doctor, id=doctor_id)

        is_self = user.id == doctor.user_id
        is_assigned_admin = (
            user.role == UserRole.HOSPITAL_ADMIN
            and user.hospital_id == doctor.hospital_id
        )
        if not (user.role == UserRole.SUPERADMIN or user.is_superuser or is_assigned_admin or is_self):
            raise PermissionDenied("You do not have permission to manage shifts for this doctor.")

        serializer.save(doctor=doctor)

    @extend_schema(tags=["Doctors & Shifts"], summary="List weekly shift schedules for doctor")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(tags=["Doctors & Shifts"], summary="Add weekly shift schedule for doctor")
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class DoctorShiftDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or remove a recurring weekly doctor shift.
    """

    queryset = DoctorShift.objects.all().select_related("doctor")
    serializer_class = DoctorShiftSerializer
    lookup_field = "id"

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsAuthenticated()]
        return [AllowAny()]

    def _check_permission(self, shift: DoctorShift):
        user = self.request.user
        doctor = shift.doctor
        is_self = user.id == doctor.user_id
        is_assigned_admin = (
            user.role == UserRole.HOSPITAL_ADMIN
            and user.hospital_id == doctor.hospital_id
        )
        if not (user.role == UserRole.SUPERADMIN or user.is_superuser or is_assigned_admin or is_self):
            raise PermissionDenied("You do not have permission to modify this shift.")

    def perform_update(self, serializer):
        shift = self.get_object()
        self._check_permission(shift)
        serializer.save()

    def perform_destroy(self, instance):
        self._check_permission(instance)
        instance.delete()

    @extend_schema(tags=["Doctors & Shifts"], summary="Retrieve shift schedule details")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(tags=["Doctors & Shifts"], summary="Update shift schedule")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @extend_schema(tags=["Doctors & Shifts"], summary="Update shift schedule (full)")
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @extend_schema(tags=["Doctors & Shifts"], summary="Delete shift schedule")
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)
