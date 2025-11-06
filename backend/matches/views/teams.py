from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.conf import settings
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from ..RequestManager import FootballDataServiceManager
from ..utils import SendResposne


@extend_schema(
    summary="Get teams from API",
    description="Fetch teams directly from Football-Data.org API",
    parameters=[
        OpenApiParameter(
            name='pk',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            description='Team ID (optional)'
        )
    ]
)
class DisplayLiveTeamsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        try:
            if pk:
                path = f"{settings.ALL_AVAILABLE_TEAMS_PATH}{pk}/"
            else:
                path = settings.ALL_AVAILABLE_TEAMS_PATH
            
            service_manager = FootballDataServiceManager(path)
            service_response = service_manager.get()
            data = SendResposne.send_response(service_response)
            return Response(data, status=data['status_code'])
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@extend_schema(
    summary="Get team matches",
    description="Fetch matches for a specific team from Football-Data.org API",
    parameters=[
        OpenApiParameter(
            name='pk',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            description='Team ID'
        )
    ]
)
class DisplayLiveMatchesForParticularTeamView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        try:
            
            path = f"{settings.ALL_AVAILABLE_TEAMS_PATH}{pk}/matches/"    
            service_manager = FootballDataServiceManager(path)
            service_response = service_manager.get()
            data = SendResposne.send_response(service_response)
            return Response(data, status=data['status_code'])
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
