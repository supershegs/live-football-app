from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.utils import extend_schema
from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class TokenResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()

class RefreshTokenSerializer(serializers.Serializer):
    refresh = serializers.CharField()

class AccessTokenSerializer(serializers.Serializer):
    access = serializers.CharField()

@extend_schema(
    summary="Login",
    description="Obtain JWT access and refresh tokens",
    request=LoginSerializer,
    responses={200: TokenResponseSerializer}
)
class CustomTokenObtainPairView(TokenObtainPairView):
    pass

@extend_schema(
    summary="Refresh Token",
    description="Refresh JWT access token using refresh token",
    request=RefreshTokenSerializer,
    responses={200: AccessTokenSerializer}
)
class CustomTokenRefreshView(TokenRefreshView):
    pass