from rest_framework import generics, status
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.conf import settings
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from ..models import Match
from ..serializers import  MatchSerializer


class SyncResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    
class SyncErrorSerializer(serializers.Serializer):
    error = serializers.CharField()

from ..RequestManager import FootballDataServiceManager
from ..utils import SendResposne





@extend_schema(
    summary="List live matches",
    description="Retrieve matches that are currently in play or paused"
)
class LiveMatchesView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = MatchSerializer
    
    def get_queryset(self):
        return Match.objects.filter(status__in=['IN_PLAY', 'PAUSED']).order_by('-utc_date')
    
    
@extend_schema(
    summary="Get live matches from API",
    description="Fetch live matches directly from Football-Data.org API",
    parameters=[
        OpenApiParameter(
            name='pk',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            description='Match ID (optional)'
        )
    ]
)
class DisplayLiveMatchesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        try:
            if pk:
                path = f"{settings.ALL_AVAILABLE_MATCHES_PATH}{pk}/"
            else:
                path = settings.ALL_AVAILABLE_MATCHES_PATH
            
            service_manager = FootballDataServiceManager(path)
            service_response = service_manager.get()
            data = SendResposne.send_response(service_response)
            return Response(data, status=data['status_code'])
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      
      
@extend_schema(
    summary="Get match head-to-head",
    description="Fetch head-to-head statistics for a specific match",
    parameters=[
        OpenApiParameter(
            name='pk',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            description='Match ID'
        )
    ]
)
class DisplayLiveMatchesH2HView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        try:
            
            path = f"{settings.ALL_AVAILABLE_MATCHES_PATH}{pk}/head2head/"    
            service_manager = FootballDataServiceManager(path)
            service_response = service_manager.get()
            data = SendResposne.send_response(service_response)
            return Response(data, status=data['status_code'])
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
