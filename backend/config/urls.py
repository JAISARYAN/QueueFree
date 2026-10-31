"""
URL configuration for QueueFree backend.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
"""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    # Django Administration Console
    path("admin/", admin.site.urls),

    # OpenAPI 3.0 Documentation Schemas & Interactive Swagger UI
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),

    # Versioned API Foundation (/api/v1/)
    path("api/v1/auth/", include("apps.accounts.urls", namespace="auth")),
    path("api/v1/hospitals/", include("apps.hospitals.urls", namespace="hospitals")),
    path("api/v1/departments/", include("apps.departments.urls", namespace="departments")),
    path("api/v1/doctors/", include("apps.doctors.urls", namespace="doctors")),
    path("api/v1/appointments/", include("apps.appointments.urls", namespace="appointments")),
    path("api/v1/", include("apps.core.urls", namespace="core")),
]
