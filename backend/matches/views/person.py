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
    summary="Get player information",
    description="Fetch player details from Football-Data.org API",
    parameters=[
        OpenApiParameter(
            name='pk',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            description='Player ID'
        )
    ]
)
class DisplayLiveplayerView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        try:
            path = f"{settings.ALL_AVAILABLE_PERSONS_PATH}{pk}/"
            
            service_manager = FootballDataServiceManager(path)
            service_response = service_manager.get()
            data = SendResposne.send_response(service_response)
            return Response(data, status=data['status_code'])
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        

@extend_schema(
    summary="Get player matches",
    description="Fetch matches for a specific player from Football-Data.org API",
    parameters=[
        OpenApiParameter(
            name='pk',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            description='Player ID'
        )
    ]
)
class DisplayLiveplayerMatchesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        try:
            path = f"{settings.ALL_AVAILABLE_PERSONS_PATH}{pk}/matches/"
            
            service_manager = FootballDataServiceManager(path)
            service_response = service_manager.get()
            data = SendResposne.send_response(service_response)
            return Response(data, status=data['status_code'])
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)