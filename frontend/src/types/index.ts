export interface Competition {
  id: number;
  external_id: number;
  name: string;
  code: string;
}

export interface Team {
  id: number;
  external_id: number;
  name: string;
  short_name: string;
}

export interface Match {
  id: number;
  external_id: number;
  competition: Competition;
  home_team: Team;
  away_team: Team;
  utc_date: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
}