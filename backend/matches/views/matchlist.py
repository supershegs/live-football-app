from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from ..models import Match
from ..serializers import MatchSerializer
from rest_framework import serializers

class SyncResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    
class SyncErrorSerializer(serializers.Serializer):
    error = serializers.CharField()



@extend_schema(
    summary="List matches",
    description="Retrieve a list of matches, optionally filtered by competition",
    parameters=[
        OpenApiParameter(
            name='competition',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description='Filter matches by competition ID'
        )
    ]
)
class MatchListView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = MatchSerializer
    
    def get_queryset(self):
        queryset = Match.objects.all().order_by('-utc_date')
        competition_id = self.request.query_params.get('competition', None)
        if competition_id:
            queryset = queryset.filter(competition__external_id=competition_id)
        return queryset

