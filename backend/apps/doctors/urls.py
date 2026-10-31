from django.urls import path
from apps.doctors.views import (
    DoctorDetailView,
    DoctorListCreateView,
    DoctorShiftDetailView,
    DoctorShiftListCreateView,
)

app_name = "doctors"

urlpatterns = [
    path("", DoctorListCreateView.as_view(), name="doctor_list_create"),
    path("<uuid:id>/", DoctorDetailView.as_view(), name="doctor_detail"),
    path("<uuid:doctor_id>/shifts/", DoctorShiftListCreateView.as_view(), name="doctor_shift_list_create"),
    path("shifts/<uuid:id>/", DoctorShiftDetailView.as_view(), name="doctor_shift_detail"),
]
