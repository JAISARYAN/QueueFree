from django.urls import path
from apps.hospitals.views import HospitalDetailView, HospitalListCreateView

app_name = "hospitals"

urlpatterns = [
    path("", HospitalListCreateView.as_view(), name="hospital_list_create"),
    path("<uuid:id>/", HospitalDetailView.as_view(), name="hospital_detail"),
]
