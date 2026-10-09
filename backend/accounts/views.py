from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView

from .models import InviteCode, Profile
from .permissions import IsOfficeUser
from .roles import role_of
from .serializers import (
    InviteCodeSerializer,
    RegisterSerializer,
    RoleTokenObtainPairSerializer,
    UserSerializer,
)
from .throttles import LoginRateThrottle


class LoginView(TokenObtainPairView):
    """POST username/password -> access + refresh tokens + user info."""

    serializer_class = RoleTokenObtainPairSerializer
    # Per-IP burst limit + per-username stuffing limit.
    throttle_classes = [AnonRateThrottle, LoginRateThrottle]


class LogoutView(APIView):
    """Blacklist the given refresh token so it can never be used again."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh = request.data.get("refresh")
        if refresh:
            try:
                RefreshToken(refresh).blacklist()
            except TokenError:
                pass  # already invalid/expired — nothing to revoke
        return Response(status=205)


class RegisterView(generics.CreateAPIView):
    """Technician self-registration; returns tokens so the user is logged in."""

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AnonRateThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        refresh["role"] = role_of(user)
        refresh["username"] = user.username

        return Response(
            {
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=201,
        )


class MeView(generics.RetrieveAPIView):
    """Return the currently authenticated user."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class InviteCodeView(generics.ListCreateAPIView):
    """
    Office-only: POST generates a fresh single-use invite code; GET lists recent
    codes so the office can see which are still available.
    """

    serializer_class = InviteCodeSerializer
    permission_classes = [permissions.IsAuthenticated, IsOfficeUser]
    queryset = InviteCode.objects.all()

    def get_queryset(self):
        return InviteCode.objects.all()[:50]

    def create(self, request, *args, **kwargs):
        role = request.data.get("role", Profile.Role.TECHNICIAN)
        if role not in Profile.Role.values:
            return Response({"role": "Invalid role."}, status=400)
        invite = InviteCode.generate(created_by=request.user, role=role)
        return Response(InviteCodeSerializer(invite).data, status=201)
