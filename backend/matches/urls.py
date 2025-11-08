from django.urls import path
from matches.views.competition import CompetitionListView
from matches.views.footballarea import FootBallAreasView
from matches.views.fetchcompetitionlive import (
    FootBallCompetitionsView,
    ParticularFootBallCompetitionsView,
    ParticularFootBallCompetitionsStandingsView,
    ParticularFootBallCompetitionsMatchesView,
    ParticularFootBallCompetitionsTeamsView,
    ParticularFootBallCompetitionsScorersView
    

)
from matches.views.livematches import (
    LiveMatchesView,
    DisplayLiveMatchesView,
    DisplayLiveMatchesH2HView
)

from matches.views.teams import (
    DisplayLiveTeamsView,
    DisplayLiveMatchesForParticularTeamView,
)

from matches.views.person import (
    DisplayLiveplayerView,
    DisplayLiveplayerMatchesView  
)

from matches.views.syncdata import sync_data
from matches.views.matchlist import MatchListView

urlpatterns = [
    path('football-areas/live/', FootBallAreasView.as_view(), name='available-live-football-areas'),
    path('football-areas/live/<int:pk>/', FootBallAreasView.as_view(), name='available-particular-live-football-areas'),   
    
    path('competitions/', CompetitionListView.as_view(), name='competitions'),
    
    path('competitions/live/', FootBallCompetitionsView.as_view(), name='available-live-competitions'),
    path('competitions/live/<int:pk>', FootBallCompetitionsView.as_view(), name='available-particular-live-competition-by-id'),
    
    path('competitions/live/<str:pk>/', ParticularFootBallCompetitionsView.as_view(), name='available-particular-live-competitions-by-league-code'),
    
    path('competitions/live/<str:pk>/standings/', ParticularFootBallCompetitionsStandingsView.as_view(), name='available-standings-for-particular-live-competitions'),
    path('competitions/live/<str:pk>/matches/', ParticularFootBallCompetitionsMatchesView.as_view(), name='available-matches-for-particular-live-competitions'),
    path('competitions/live/<str:pk>/teams/', ParticularFootBallCompetitionsTeamsView.as_view(), name='available-teams-for-particular-live-competitions'),
    path('competitions/live/<str:pk>/scorers/', ParticularFootBallCompetitionsScorersView.as_view(), name='available-scorers-for-particuar-live-competitions'),
    
    
    
    # path('matches/', MatchListView.as_view(), name='matches'),
    # path('live-matches/', LiveMatchesView.as_view(), name='live-matches'),   
    path('matches/live/', DisplayLiveMatchesView.as_view(), name='available-live-matches'),
    path('matches/live/<int:pk>/', DisplayLiveMatchesView.as_view(), name='available-particular-live-matches'),
    path('matches/live/<int:pk>/head2head/', DisplayLiveMatchesH2HView.as_view(), name='available-particular-live-matches-h2h'),
    
    
    
    path('teams/live/', DisplayLiveTeamsView.as_view(), name='available-live-teams'),
    path('teams/live/<int:pk>/', DisplayLiveTeamsView.as_view(), name='available-particular-live-teams'),
    path('teams/live/<int:pk>/matches/', DisplayLiveMatchesForParticularTeamView.as_view(), name='available-particular-live-team'),
    
    
    path('player/live/<int:pk>/', DisplayLiveplayerView.as_view(), name='available-particular-live-players'),
    path('player/live/<int:pk>/matches/', DisplayLiveplayerMatchesView.as_view(), name='available-particular-live-players-matches'),
    
    path('sync/', sync_data, name='sync-data'),
]