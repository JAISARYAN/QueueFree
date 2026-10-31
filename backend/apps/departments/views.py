from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from apps.accounts.models import UserRole
from apps.departments.models import Department
from apps.departments.serializers import DepartmentSerializer


class DepartmentListCreateView(generics.ListCreateAPIView):
    """
    List clinical departments (optionally filtered by hospital)
    or create a new department within a facility.
    """

    queryset = Department.objects.filter(is_active=True).select_related("hospital").prefetch_related("doctors")
    serializer_class = DepartmentSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        qs = super().get_queryset()
        hospital_id = self.request.query_params.get("hospital_id")
        search = self.request.query_params.get("search")

        if hospital_id:
            qs = qs.filter(hospital_id=hospital_id)
        if search:
            qs = qs.filter(name__icontains=search.strip()) | qs.filter(code__icontains=search.strip())
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
            raise PermissionDenied("You can only create departments for your assigned hospital.")

        serializer.save()

    @extend_schema(
        tags=["Departments & Specialties"],
        summary="List active clinical departments",
        parameters=[
            OpenApiParameter(name="hospital_id", description="Filter by hospital UUID", required=False, type=str),
            OpenApiParameter(name="search", description="Search by department name or code", required=False, type=str),
        ],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        tags=["Departments & Specialties"],
        summary="Create clinical department (Hospital Admin or Superadmin)",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or soft-delete a clinical department.
    """

    queryset = Department.objects.all().select_related("hospital")
    serializer_class = DepartmentSerializer
    lookup_field = "id"

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [IsAuthenticated()]
        return [AllowAny()]

    def _check_admin_permission(self, department: Department):
        user = self.request.user
        is_assigned_admin = (
            user.role == UserRole.HOSPITAL_ADMIN
            and user.hospital_id == department.hospital_id
        )
        if not (user.role == UserRole.SUPERADMIN or user.is_superuser or is_assigned_admin):
            raise PermissionDenied("You do not have administrative privileges for this department.")

    def perform_update(self, serializer):
        dept = self.get_object()
        self._check_admin_permission(dept)
        serializer.save()

    def perform_destroy(self, instance):
        self._check_admin_permission(instance)
        # Soft-delete: mark inactive
        instance.is_active = False
        instance.save(update_fields=["is_active"])

    @extend_schema(tags=["Departments & Specialties"], summary="Retrieve department details")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(tags=["Departments & Specialties"], summary="Update clinical department")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @extend_schema(tags=["Departments & Specialties"], summary="Update clinical department (full)")
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @extend_schema(tags=["Departments & Specialties"], summary="Deactivate clinical department")
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)
