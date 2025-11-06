from django.db import models

class Competition(models.Model):
    external_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10)
    
    def __str__(self):
        return self.name

class Team(models.Model):
    external_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=100)
    short_name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name

class Match(models.Model):
    external_id = models.IntegerField(unique=True)
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)
    home_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='home_matches')
    away_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='away_matches')
    utc_date = models.DateTimeField()
    status = models.CharField(max_length=20)
    home_score = models.IntegerField(null=True, blank=True)
    away_score = models.IntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.home_team} vs {self.away_team}"