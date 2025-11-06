from django.contrib import admin
from .models import Competition, Team, Match

@admin.register(Competition)
class CompetitionAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'external_id']

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'short_name', 'external_id']

@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ['home_team', 'away_team', 'competition', 'utc_date', 'status']
    list_filter = ['status', 'competition']