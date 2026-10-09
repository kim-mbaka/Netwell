from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import InviteCode, Profile
from .roles import role_of

User = get_user_model()


class InviteCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = InviteCode
        fields = ("code", "role", "created_at", "used_by", "used_at")
        read_only_fields = fields


class UserSerializer(serializers.ModelSerializer):
    """Public-safe representation of a user, used by /me/ and register output."""

    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "role")
        read_only_fields = ("id", "role")

    def get_role(self, obj) -> str:
        return role_of(obj)


class RegisterSerializer(serializers.ModelSerializer):
    """
    Technician self-registration, gated by a single-use invite code issued by
    the office. The invite code decides the role (technician unless the office
    explicitly minted an office invite).
    """

    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)
    invite_code = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "password2",
            "invite_code",
        )

    def validate_invite_code(self, value):
        code = (value or "").strip().upper()
        try:
            invite = InviteCode.objects.get(code=code)
        except InviteCode.DoesNotExist:
            raise serializers.ValidationError("Invalid invitation code.")
        if invite.is_used:
            raise serializers.ValidationError("This invitation code has already been used.")
        self._invite = invite
        return code

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop("password2")
        validated_data.pop("invite_code")
        password = validated_data.pop("password")
        # Lock the invite row and re-check inside a transaction so two people
        # submitting the same code at once can never both register — the first
        # commit wins, the second is rejected.
        with transaction.atomic():
            invite = InviteCode.objects.select_for_update().get(pk=self._invite.pk)
            if invite.is_used:
                raise serializers.ValidationError(
                    {"invite_code": "This invitation code has already been used."}
                )
            user = User(**validated_data)
            user.set_password(password)
            user.save()  # post_save signal creates the Profile (default technician)
            profile = user.profile
            if profile.role != invite.role:
                profile.role = invite.role
                profile.save(update_fields=["role"])
            invite.mark_used(user)
        return user


class RoleTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Login serializer that embeds the role in the token and echoes user info."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = role_of(user)
        token["username"] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data
