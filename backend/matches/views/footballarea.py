from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from ..RequestManager import FootballDataServiceManager
from ..utils import SendResposne


@extend_schema(
    summary="Get football areas",
    description="Retrieve all available football areas or a specific area by ID",
    parameters=[
        OpenApiParameter(
            name='pk',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.PATH,
            description='Area ID (optional)'
        )
    ]
)
class FootBallAreasView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk=None):
        try:
            if pk:
                path = f"{settings.ALL_AREA_PATH}{pk}/"
            else:
                path = settings.ALL_AREA_PATH

            service_manager = FootballDataServiceManager(path)
            service_response = service_manager.get()
            data = SendResposne.send_response(service_response)
            return Response(data, status=data['status_code'])

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
