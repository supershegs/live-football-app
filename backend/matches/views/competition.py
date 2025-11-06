from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from drf_spectacular.utils import extend_schema


from ..models import Competition
from ..serializers import CompetitionSerializer
from rest_framework import serializers

class SyncResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    
class SyncErrorSerializer(serializers.Serializer):
    error = serializers.CharField()
    



@extend_schema(
    summary="List all competitions",
    description="Retrieve a list of all football competitions from local database"
)
class CompetitionListView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer



