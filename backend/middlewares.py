import logging
import json
import os
from datetime import datetime
from django.utils.deprecation import MiddlewareMixin

# Create logs directory if it doesn't exist
log_dir = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(log_dir, exist_ok=True)

# Configure logger
logger = logging.getLogger('request_response')
logger.setLevel(logging.INFO)

# Create file handler
log_file = os.path.join(log_dir, 'general.log')
file_handler = logging.FileHandler(log_file)
file_handler.setLevel(logging.INFO)

# Create formatter
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# Add handler to logger
if not logger.handlers:
    logger.addHandler(file_handler)

class RequestResponseLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Store request time for response logging
        request._start_time = datetime.now()
        
        # Log request
        request_data = {
            'method': request.method,
            'path': request.path,
            'user': str(request.user) if hasattr(request, 'user') else 'Anonymous',
            'ip': self.get_client_ip(request),
            'headers': dict(request.headers),
            'query_params': dict(request.GET),
            'start_time': request._start_time.isoformat(),
        }
        
        # Log request body for POST/PUT/PATCH
        if request.method in ['POST', 'PUT', 'PATCH']:
            try:
                if request.content_type == 'application/json':
                    request_data['body'] = json.loads(request.body.decode('utf-8'))
                else:
                    request_data['body'] = dict(request.POST)
            except:
                request_data['body'] = 'Unable to parse body'
        
        logger.info(f"REQUEST: {json.dumps(request_data, indent=2)}")
        
    def process_response(self, request, response):
        # Calculate response time
        end_time = datetime.now()
        if hasattr(request, '_start_time'):
            response_time = (end_time - request._start_time).total_seconds()
        else:
            response_time = 0
            
        # Log response
        response_data = {
            'status_code': response.status_code,
            'path': request.path,
            'method': request.method,
            'start_time': request._start_time.isoformat() if hasattr(request, '_start_time') else None,
            'end_time': end_time.isoformat(),
            'response_time_seconds': response_time,
            'content_type': response.get('Content-Type', ''),
        }
        
        # Log response body for non-binary content
        try:
            if response.get('Content-Type', '').startswith('application/json'):
                response_data['body'] = json.loads(response.content.decode('utf-8'))
            elif response.status_code >= 400:
                response_data['body'] = response.content.decode('utf-8')[:1000]  # Limit error content
        except:
            response_data['body'] = 'Unable to parse response body'
            
        logger.info(f"RESPONSE: {json.dumps(response_data, indent=2)}")
        
        return response
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip