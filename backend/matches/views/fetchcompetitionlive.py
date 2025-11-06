from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from django.conf import settings
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes


from rest_framework import serializers

class SyncResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    
class SyncErrorSerializer(serializers.Serializer):
    error = serializers.CharField()
    

from ..RequestManager import FootballDataServiceManager
from ..utils import SendResposne



@extend_schema(
    summary="Fetch competitions from API",
    description="Fetch competitions directly from Football-Data.org API (live data)"
)
class FootBallCompetitionsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        try:
            if pk:
                path = f"{settings.ALL_AVAILABLE_COMPETITIONS_PATH}{pk}/"
            else:
                path = settings.ALL_AVAILABLE_COMPETITIONS_PATH
            
            service_manager = FootballDataServiceManager(path)
            service_response = service_manager.get()
            data = SendResposne.send_response(service_response)
            return Response(data, status=data['status_code'])
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      

@extend_schema(
    summary="Fetch Particular competitions from API",
    description="Fetch competitions directly from Football-Data.org API (live data)"
)  
class ParticularFootBallCompetitionsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        try:
            
            path = f"{settings.ALL_AVAILABLE_COMPETITIONS_PATH}{pk}/"
            
            service_manager = FootballDataServiceManager(path)
            service_response = service_manager.get()
            data = SendResposne.send_response(service_response)
            return Response(data, status=data['status_code'])
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@extend_schema(
    summary="Get competition standings",
    description="Fetch standings for a specific competition from Football-Data.org API",
    parameters=[
        OpenApiParameter(
            name='pk',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.PATH,
            description='Competition code (e.g., PL, CL)'
        )
    ]
)
class ParticularFootBallCompetitionsStandingsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        try:
            
            path = f"{settings.ALL_AVAILABLE_COMPETITIONS_PATH}{pk}/standings/"
            
            service_manager = FootballDataServiceManager(path)
            service_response = service_manager.get()
            data = SendResposne.send_response(service_response)
            return Response(data, status=data['status_code'])
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


@extend_schema(
    summary="Get competition matches",
    description="Fetch matches for a specific competition from Football-Data.org API",
    parameters=[
        OpenApiParameter(
            name='pk',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.PATH,
            description='Competition code (e.g., PL, CL)'
        )
    ]
)
class ParticularFootBallCompetitionsMatchesView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        try:
            
            path = f"{settings.ALL_AVAILABLE_COMPETITIONS_PATH}{pk}/matches/"
            
            service_manager = FootballDataServiceManager(path)
            service_response = service_manager.get()
            data = SendResposne.send_response(service_response)
            return Response(data, status=data['status_code'])
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@extend_schema(
    summary="Get competition teams",
    description="Fetch teams for a specific competition from Football-Data.org API",
    parameters=[
        OpenApiParameter(
            name='pk',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.PATH,
            description='Competition code (e.g., PL, CL)'
        )
    ]
)
class ParticularFootBallCompetitionsTeamsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        try:
            
            path = f"{settings.ALL_AVAILABLE_COMPETITIONS_PATH}{pk}/teams/"
            
            service_manager = FootballDataServiceManager(path)
            service_response = service_manager.get()
            data = SendResposne.send_response(service_response)
            return Response(data, status=data['status_code'])
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@extend_schema(
    summary="Get competition scorers",
    description="Fetch top scorers for a specific competition from Football-Data.org API",
    parameters=[
        OpenApiParameter(
            name='pk',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.PATH,
            description='Competition code (e.g., PL, CL)'
        )
    ]
)
class ParticularFootBallCompetitionsScorersView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        try:
            
            path = f"{settings.ALL_AVAILABLE_COMPETITIONS_PATH}{pk}/scorers/"
            
            service_manager = FootballDataServiceManager(path)
            service_response = service_manager.get()
            data = SendResposne.send_response(service_response)
            return Response(data, status=data['status_code'])
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
