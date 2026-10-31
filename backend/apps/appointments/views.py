from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.accounts.models import UserRole
from apps.appointments.models import AppointmentSlot
from apps.appointments.serializers import (
    AppointmentSlotSerializer,
    SlotBlockToggleSerializer,
    SlotGenerationRequestSerializer,
)
from apps.appointments.services import SlotGenerationService
from apps.doctors.models import Doctor


class AppointmentSlotListView(generics.ListAPIView):
    """
    Query available or scheduled appointment slots for booking and queue scheduling.
    """

    permission_classes = [AllowAny]
    serializer_class = AppointmentSlotSerializer

    def get_queryset(self):
        qs = (
            AppointmentSlot.objects.all()
            .select_related("doctor", "doctor__user", "doctor__department", "hospital")
            .order_index() if hasattr(AppointmentSlot.objects, "order_index") else AppointmentSlot.objects.select_related("doctor", "doctor__user", "doctor__department", "hospital")
        )

        doctor_id = self.request.query_params.get("doctor_id")
        hospital_id = self.request.query_params.get("hospital_id")
        slot_date = self.request.query_params.get("date")
        slot_type = self.request.query_params.get("slot_type")
        available_only = self.request.query_params.get("available_only", "true").lower() == "true"

        if doctor_id:
            qs = qs.filter(doctor_id=doctor_id)
        if hospital_id:
            qs = qs.filter(hospital_id=hospital_id)
        if slot_date:
            qs = qs.filter(slot_date=slot_date)
        if slot_type:
            qs = qs.filter(slot_type=slot_type)
        if available_only:
            qs = qs.filter(is_booked=False, is_blocked=False)

        return qs.order_by("slot_date", "start_time")

    @extend_schema(
        tags=["Appointments & Slots"],
        summary="List consultation slots",
        parameters=[
            OpenApiParameter(name="doctor_id", description="Doctor UUID", required=False, type=str),
            OpenApiParameter(name="hospital_id", description="Hospital UUID", required=False, type=str),
            OpenApiParameter(name="date", description="Slot date (YYYY-MM-DD)", required=False, type=str),
            OpenApiParameter(name="slot_type", description="ONLINE, WALKIN_BUFFER, VIP_EMERGENCY", required=False, type=str),
            OpenApiParameter(name="available_only", description="Filter only unbooked/unblocked slots (default: true)", required=False, type=bool),
        ],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class AppointmentSlotGenerateView(APIView):
    """
    Triggers dynamic slot generation for a doctor over a specified calendar range
    using their configured recurring shift schedules.
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Appointments & Slots"],
        summary="Generate consultation slots for doctor",
        request=SlotGenerationRequestSerializer,
        responses={
            200: OpenApiResponse(description="Slots successfully generated."),
            400: OpenApiResponse(description="Validation error."),
            403: OpenApiResponse(description="Permission denied."),
        },
    )
    def post(self, request: Request) -> Response:
        serializer = SlotGenerationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        doctor = generics.get_object_or_404(Doctor, id=data["doctor_id"])
        user = request.user

        # Authorization: Doctor themselves, Hospital Admin of doctor's hospital, or Superadmin
        is_self = user.id == doctor.user_id
        is_assigned_admin = (
            user.role == UserRole.HOSPITAL_ADMIN
            and user.hospital_id == doctor.hospital_id
        )
        if not (user.role == UserRole.SUPERADMIN or user.is_superuser or is_assigned_admin or is_self):
            raise PermissionDenied("You do not have permission to generate slots for this doctor.")

        result = SlotGenerationService.generate_slots_for_doctor(
            doctor=doctor,
            start_date=data["start_date"],
            end_date=data["end_date"],
            replace_existing_unbooked=data.get("replace_existing_unbooked", False),
        )

        return Response(
            {
                "message": f"Successfully generated {result['slots_created']} slots across {result['dates_processed']} days.",
                "data": result,
            },
            status=status.HTTP_200_OK,
        )


class AppointmentSlotBlockToggleView(APIView):
    """
    Toggles a slot's blocked status (e.g. for doctor emergency or clinical break).
    """

    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Appointments & Slots"],
        summary="Block or unblock consultation slot",
        request=SlotBlockToggleSerializer,
        responses={200: AppointmentSlotSerializer},
    )
    def patch(self, request: Request, id: str) -> Response:
        slot = generics.get_object_or_404(AppointmentSlot, id=id)
        user = request.user

        is_self = user.id == slot.doctor.user_id
        is_assigned_admin = (
            user.role == UserRole.HOSPITAL_ADMIN
            and user.hospital_id == slot.hospital_id
        )
        if not (user.role == UserRole.SUPERADMIN or user.is_superuser or is_assigned_admin or is_self):
            raise PermissionDenied("You do not have permission to block slots for this doctor.")

        serializer = SlotBlockToggleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        slot.is_blocked = serializer.validated_data["is_blocked"]
        slot.save(update_fields=["is_blocked", "updated_at"])

        return Response(AppointmentSlotSerializer(slot).data, status=status.HTTP_200_OK)
