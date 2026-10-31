from datetime import datetime, timezone
from django.db import connection
from django.db.utils import OperationalError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiResponse


class HealthCheckView(APIView):
    """
    QueueFree System Health & Observability Check.
    Returns the real-time operational status of backend services,
    including the active database connection state.
    """
    authentication_classes = []
    permission_classes = []

    @extend_schema(
        summary="System Health & Diagnostic Check",
        description="Inspects service liveness, database connectivity, and runtime metrics.",
        responses={
            200: OpenApiResponse(description="Health diagnostic payload returned successfully.")
        },
        tags=["System Observability"]
    )
    def get(self, request, *args, **kwargs):
        db_status = "connected"
        db_error = None

        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1;")
                cursor.fetchone()
        except OperationalError as err:
            db_status = "disconnected"
            db_error = str(err).strip()
        except Exception as err:
            db_status = "error"
            db_error = str(err).strip()

        overall_status = "healthy" if db_status == "connected" else "degraded"

        payload = {
            "status": overall_status,
            "service": "QueueFree API",
            "version": "1.0.0",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "checks": {
                "database": {
                    "status": db_status,
                    "engine": connection.settings_dict.get("ENGINE", "unknown"),
                    "name": connection.settings_dict.get("NAME", "unknown"),
                    "host": connection.settings_dict.get("HOST", "unknown"),
                    "port": connection.settings_dict.get("PORT", "unknown"),
                    "error": db_error,
                },
                "cache": {
                    "status": "deferred_phase_5",
                    "provider": "redis"
                }
            }
        }

        # Return 200 with diagnostic payload
        return Response(payload, status=status.HTTP_200_OK)
