from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from apps.accounts.models import UserRole
from apps.accounts.permissions import IsSuperAdmin
from apps.hospitals.models import Hospital
from apps.hospitals.serializers import (
    HospitalCreateUpdateSerializer,
    HospitalSerializer,
)


class HospitalListCreateView(generics.ListCreateAPIView):
    """
    List active hospitals or onboard a new hospital facility.
    Public users can browse facilities; Superadmins can onboard new hospital organizations.
    """

    queryset = Hospital.objects.filter(is_active=True).prefetch_related("departments", "doctors")

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsSuperAdmin()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return HospitalCreateUpdateSerializer
        return HospitalSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        city = self.request.query_params.get("city")
        search = self.request.query_params.get("search")

        if city:
            qs = qs.filter(city__iexact=city.strip())
        if search:
            qs = qs.filter(name__icontains=search.strip()) | qs.filter(code__icontains=search.strip())
        return qs.distinct()

    @extend_schema(
        tags=["Hospitals & Facilities"],
        summary="List active hospitals",
        parameters=[
            OpenApiParameter(name="city", description="Filter by city name", required=False, type=str),
            OpenApiParameter(name="search", description="Search by hospital name or code", required=False, type=str),
        ],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        tags=["Hospitals & Facilities"],
        summary="Onboard new hospital organization (Superadmin only)",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class HospitalDetailView(generics.RetrieveUpdateAPIView):
    """
    Retrieve or update a hospital facility profile.
    Hospital Admins can update their assigned hospital; Superadmins can update any hospital.
    """

    queryset = Hospital.objects.all()
    lookup_field = "id"

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH"]:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return HospitalCreateUpdateSerializer
        return HospitalSerializer

    def perform_update(self, serializer):
        user = self.request.user
        hospital_instance = self.get_object()

        # Authorization check: Superadmin or assigned Hospital Admin
        is_assigned_admin = (
            user.role == UserRole.HOSPITAL_ADMIN
            and user.hospital_id == hospital_instance.id
        )
        if not (user.role == UserRole.SUPERADMIN or user.is_superuser or is_assigned_admin):
            raise PermissionDenied("You do not have administrative privileges for this hospital.")

        serializer.save()

    @extend_schema(tags=["Hospitals & Facilities"], summary="Retrieve hospital facility details")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(tags=["Hospitals & Facilities"], summary="Update hospital profile and operational rules")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @extend_schema(tags=["Hospitals & Facilities"], summary="Update entire hospital profile")
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
