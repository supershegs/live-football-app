from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from drf_spectacular.utils import extend_schema
from rest_framework import serializers

class SyncResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
    
class SyncErrorSerializer(serializers.Serializer):
    error = serializers.CharField()
from ..services import FootballDataService




@extend_schema(
    summary="Sync data from Football-Data.org",
    description="Fetch and sync latest competitions and matches from Football-Data.org API",
    responses={
        200: SyncResponseSerializer,
        500: SyncErrorSerializer
    }
)
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def sync_data(request):
    service = FootballDataService()
    try:
        service.sync_competitions()
        service.sync_matches()
        return Response({'message': 'Data synced successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)