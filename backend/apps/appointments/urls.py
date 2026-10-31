from django.urls import path
from apps.appointments.views import (
    AppointmentSlotBlockToggleView,
    AppointmentSlotGenerateView,
    AppointmentSlotListView,
)

app_name = "appointments"

urlpatterns = [
    path("slots/", AppointmentSlotListView.as_view(), name="slot_list"),
    path("slots/generate/", AppointmentSlotGenerateView.as_view(), name="slot_generate"),
    path("slots/<uuid:id>/block/", AppointmentSlotBlockToggleView.as_view(), name="slot_block_toggle"),
]
