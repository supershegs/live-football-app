import requests
from django.conf import settings
from .models import Competition, Team, Match
from datetime import datetime

class FootballDataService:
    BASE_URL = "https://api.football-data.org/v4"
    
    def __init__(self):
        self.headers = {
            'X-Auth-Token': settings.FOOTBALL_API_KEY
        }
    
    def fetch_competitions(self):
        url = f"{self.BASE_URL}/competitions"
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            return response.json()
        return None
    
    def fetch_matches(self, competition_id=None):
        if competition_id:
            url = f"{self.BASE_URL}/competitions/{competition_id}/matches"
        else:
            url = f"{self.BASE_URL}/matches"
        
        response = requests.get(url, headers=self.headers)
        if response.status_code == 200:
            return response.json()
        return None
    
    def sync_competitions(self):
        data = self.fetch_competitions()
        if data and 'competitions' in data:
            for comp_data in data['competitions']:
                Competition.objects.update_or_create(
                    external_id=comp_data['id'],
                    defaults={
                        'name': comp_data['name'],
                        'code': comp_data['code']
                    }
                )
    
    def sync_matches(self, competition_id=None):
        data = self.fetch_matches(competition_id)
        if data and 'matches' in data:
            for match_data in data['matches']:
                # Create or update teams
                home_team, _ = Team.objects.update_or_create(
                    external_id=match_data['homeTeam']['id'],
                    defaults={
                        'name': match_data['homeTeam']['name'],
                        'short_name': match_data['homeTeam']['shortName'] or match_data['homeTeam']['name']
                    }
                )
                
                away_team, _ = Team.objects.update_or_create(
                    external_id=match_data['awayTeam']['id'],
                    defaults={
                        'name': match_data['awayTeam']['name'],
                        'short_name': match_data['awayTeam']['shortName'] or match_data['awayTeam']['name']
                    }
                )
                
                # Create or update competition
                competition, _ = Competition.objects.update_or_create(
                    external_id=match_data['competition']['id'],
                    defaults={
                        'name': match_data['competition']['name'],
                        'code': match_data['competition']['code']
                    }
                )
                
                # Create or update match
                Match.objects.update_or_create(
                    external_id=match_data['id'],
                    defaults={
                        'competition': competition,
                        'home_team': home_team,
                        'away_team': away_team,
                        'utc_date': datetime.fromisoformat(match_data['utcDate'].replace('Z', '+00:00')),
                        'status': match_data['status'],
                        'home_score': match_data['score']['fullTime']['home'],
                        'away_score': match_data['score']['fullTime']['away']
                    }
                )