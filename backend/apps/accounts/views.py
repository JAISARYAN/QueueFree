from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.accounts.models import User
from apps.accounts.serializers import (
    ChangePasswordSerializer,
    LogoutRequestSerializer,
    QueueFreeTokenObtainPairSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer,
)


class RegisterView(APIView):
    """
    Public registration endpoint strictly for Patient accounts.
    Returns the newly created user record along with initial JWT access and refresh tokens.
    """
    permission_classes = [AllowAny]

    @extend_schema(
        request=UserRegistrationSerializer,
        responses={
            201: OpenApiResponse(
                description="Patient account successfully registered.",
            ),
            400: OpenApiResponse(
                description="Validation failure (e.g. email in use or weak password).",
            ),
        },
        tags=["Authentication"],
    )
    def post(self, request: Request) -> Response:
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user: User = serializer.save()

        # Generate JWT tokens immediately upon registration
        refresh = RefreshToken.for_user(user)
        refresh["email"] = user.email
        refresh["role"] = user.role
        refresh["first_name"] = user.first_name
        refresh["last_name"] = user.last_name
        refresh["hospital_id"] = str(user.hospital_id) if user.hospital_id else None
        refresh["is_verified"] = user.is_verified

        return Response(
            {
                "message": "Account registered successfully.",
                "user": UserProfileSerializer(user).data,
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    """
    Authentication endpoint providing JWT access and refresh tokens
    along with authenticated user metadata.
    """
    permission_classes = [AllowAny]
    serializer_class = QueueFreeTokenObtainPairSerializer

    @extend_schema(
        tags=["Authentication"],
        description="Authenticates with email and password, issuing JWT pair with embedded claims.",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class QueueFreeTokenRefreshView(TokenRefreshView):
    """
    Token refresh endpoint yielding new access tokens using a valid refresh token.
    """
    permission_classes = [AllowAny]

    @extend_schema(
        tags=["Authentication"],
        description="Issues a refreshed access token using a valid unexpired refresh token.",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    """
    Blacklists the supplied JWT refresh token, terminating the active session.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Authentication"],
        request=LogoutRequestSerializer,
        description="Terminates active session by invalidating the refresh token.",
        responses={200: OpenApiResponse(description="Successfully logged out.")},
    )
    def post(self, request: Request) -> Response:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Refresh token is required to invalidate session."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Session invalidated successfully."},
                status=status.HTTP_200_OK,
            )
        except Exception:
            return Response(
                {"error": "Invalid or expired token provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CurrentUserView(APIView):
    """
    Retrieves or updates the currently authenticated user's profile details.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Authentication"],
        responses={200: UserProfileSerializer},
        description="Returns detailed profile of the authenticated user.",
    )
    def get(self, request: Request) -> Response:
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        tags=["Authentication"],
        request=UserProfileSerializer,
        responses={200: UserProfileSerializer},
        description="Updates profile information for the authenticated user.",
    )
    def patch(self, request: Request) -> Response:
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        tags=["Authentication"],
        request=UserProfileSerializer,
        responses={200: UserProfileSerializer},
        description="Updates full profile information for the authenticated user.",
    )
    def put(self, request: Request) -> Response:
        return self.patch(request)


class ChangePasswordView(APIView):
    """
    Allows authenticated users to change their account password.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["Authentication"],
        request=ChangePasswordSerializer,
        responses={200: OpenApiResponse(description="Password changed successfully.")},
        description="Validates current password and updates to new password.",
    )
    def post(self, request: Request) -> Response:
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )
