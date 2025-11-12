import axios from 'axios';
import { Competition, Match, Team, AuthTokens, LoginCredentials } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT token to requests
api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('access_token');
  if (!token) {
    await authApi.getToken();
    token = localStorage.getItem('access_token');
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken
          });
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          error.config.headers.Authorization = `Bearer ${access}`;
          return api.request(error.config);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          await authApi.getToken();
          const newToken = localStorage.getItem('access_token');
          if (newToken) {
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return api.request(error.config);
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  getToken: async (): Promise<void> => {
    if (!localStorage.getItem('access_token')) {
      const response = await axios.post(`${API_BASE_URL}/auth/token/`, {
        username: process.env.REACT_APP_API_USERNAME,
        password: process.env.REACT_APP_API_PASSWORD
      });
      const tokens = response.data;
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
    }
  }
};

export const footballApi = {
  // Competitions (Available endpoints)
  getCompetitions: (): Promise<Competition[]> =>
    api.get('/competitions/').then(response => response.data),
  
  getLiveCompetitions: (): Promise<any[]> =>
    api.get('/competitions/live/').then(response => response.data),
  
  getCompetitionById: (id: number): Promise<any> =>
    api.get(`/competitions/live/${id}`).then(response => response.data),
  
  getCompetitionDetails: (code: string): Promise<any> =>
    api.get(`/competitions/live/${code}/`).then(response => response.data),
  
  getCompetitionStandings: (code: string): Promise<any> =>
    api.get(`/competitions/live/${code}/standings/`).then(response => response.data),
  
  getCompetitionMatches: (code: string): Promise<any> =>
    api.get(`/competitions/live/${code}/matches/`).then(response => response.data),
  
  getCompetitionTeams: (code: string): Promise<any> =>
    api.get(`/competitions/live/${code}/teams/`).then(response => response.data),
  
  getCompetitionScorers: (code: string): Promise<any> =>
    api.get(`/competitions/live/${code}/scorers/`).then(response => response.data),
  
  // Matches (Available endpoints)
  getLiveMatchesFromAPI: (): Promise<any> =>
    api.get('/matches/live/').then(response => response.data),
  
  getMatchDetails: (id: number): Promise<any> =>
    api.get(`/matches/live/${id}/`).then(response => response.data),
  
  getMatchH2H: (id: number): Promise<any> =>
    api.get(`/matches/live/${id}/head2head/`).then(response => response.data),
  
  // Teams (Available endpoints)
  getLiveTeams: (): Promise<any[]> =>
    api.get('/teams/live/').then(response => response.data),
  
  getTeamDetails: (id: number): Promise<any> =>
    api.get(`/teams/live/${id}/`).then(response => response.data),
  
  getTeamMatches: (id: number): Promise<any> =>
    api.get(`/teams/live/${id}/matches/`).then(response => response.data),
  
  // Players (Available endpoints)
  getPlayerDetails: (id: number): Promise<any> =>
    api.get(`/player/live/${id}/`).then(response => response.data),
  
  getPlayerMatches: (id: number): Promise<any> =>
    api.get(`/player/live/${id}/matches/`).then(response => response.data),
  
  // Areas (Available endpoints)
  getFootballAreas: (): Promise<any[]> =>
    api.get('/football-areas/live/').then(response => response.data),
  
  getFootballAreaDetails: (id: number): Promise<any> =>
    api.get(`/football-areas/live/${id}/`).then(response => response.data),
  
  // Live Stream Matches
  getLiveStreamMatches: (): Promise<any> =>
    api.get('/live/stream/matches/').then(response => response.data),
  
  getLiveStreamLink: (id: string): Promise<any> =>
    api.get(`/live/stream/matches/${id}/`).then(response => response.data),
  
  // Sync (Available endpoint)
  syncData: (): Promise<void> =>
    api.post('/sync/').then(response => response.data),
};