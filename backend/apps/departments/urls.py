from django.urls import path
from apps.departments.views import DepartmentDetailView, DepartmentListCreateView

app_name = "departments"

urlpatterns = [
    path("", DepartmentListCreateView.as_view(), name="department_list_create"),
    path("<uuid:id>/", DepartmentDetailView.as_view(), name="department_detail"),
]
