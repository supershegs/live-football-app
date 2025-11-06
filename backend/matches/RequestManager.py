import requests

from django.conf import settings
from rest_framework.response import Response




class FootballDataServiceManager:
    def __init__(self, path: str):
        self.api_url = f"{settings.FOOTBALL_API_BASE_URL}{path}"
        self.headers = {
            'X-Auth-Token': settings.FOOTBALL_API_KEY
        }

    def get(self, params=None):
        try: 
            response = requests.get(self.api_url, headers=self.headers, params=params)
            print(self.api_url, response, response.status_code) # response.text)
            return response
        except requests.RequestException as e:
            print(f"An error occurred: {e}")
            return None

    def post(self, data=None):
        try:
            response = requests.post(self.api_url, headers=self.headers, data=data)
            return response
        except requests.RequestException as e:
            print(f"An error occurred: {e}")
            return None

    def put(self, data=None):
        try:
            response = requests.post(self.api_url, headers=self.headers, data=data)
            return response
        except requests.RequestException as e:
            print(f"An error occurred: {e}")
            return None

    def delete(self):
        try:
            response = requests.delete(self.api_url, headers=self.headers)
            return response
        except requests.RequestException as e:
            print(f"An error occurred: {e}")
            return None
    
    def patch(self, data=None):
        try:
            response = requests.patch(self.api_url, headers=self.headers, data=data)
            return response
        except requests.RequestException as e:
            print(f"An error occurred: {e}")
            return None