import axios from 'axios';
import { Competition, Match } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const footballApi = {
  getCompetitions: (): Promise<Competition[]> =>
    api.get('/competitions/').then(response => response.data),
  
  getMatches: (competitionId?: number): Promise<Match[]> => {
    const url = competitionId 
      ? `/matches/?competition=${competitionId}`
      : '/matches/';
    return api.get(url).then(response => response.data);
  },
  
  getLiveMatches: (): Promise<Match[]> =>
    api.get('/live-matches/').then(response => response.data),
  
  syncData: (): Promise<void> =>
    api.post('/sync/').then(response => response.data),
};