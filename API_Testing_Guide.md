# API Testing Guide

## Authentication Required

**All endpoints require JWT authentication.** First obtain a token, then include it in all requests.

## Quick Setup

1. **Start Backend Server**
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Create User**
   ```bash
   python manage.py createsuperuser
   ```

3. **Get JWT Token**
   ```bash
   curl -X POST http://localhost:8000/api/auth/token/ \
     -H "Content-Type: application/json" \
     -d '{"username": "your_username", "password": "your_password"}'
   ```

## All Available Endpoints

### Authentication
- `POST /api/auth/token/` - Login (get JWT tokens)
- `POST /api/auth/token/refresh/` - Refresh access token

### Football Areas
- `GET /api/football-areas/live/` - Get all football areas
- `GET /api/football-areas/live/{id}/` - Get specific football area

### Competitions (Database)
- `GET /api/competitions/` - List competitions from database

### Competitions (Live API)
- `GET /api/competitions/live/` - Get live competitions
- `GET /api/competitions/live/{id}` - Get specific competition by ID
- `GET /api/competitions/live/{code}/` - Get competition by code (PL, CL, etc.)
- `GET /api/competitions/live/{code}/standings/` - Get competition standings
- `GET /api/competitions/live/{code}/matches/` - Get competition matches
- `GET /api/competitions/live/{code}/teams/` - Get competition teams
- `GET /api/competitions/live/{code}/scorers/` - Get competition top scorers

### Matches (Database)
- `GET /api/matches/` - List matches from database
- `GET /api/matches/?competition={id}` - Filter matches by competition
- `GET /api/live-matches/` - List live matches from database

### Matches (Live API)
- `GET /api/matches/live/` - Get live matches from API
- `GET /api/matches/live/{id}/` - Get specific match
- `GET /api/matches/live/{id}/head2head/` - Get match head-to-head stats

### Teams
- `GET /api/teams/live/` - Get all teams
- `GET /api/teams/live/{id}/` - Get specific team
- `GET /api/teams/live/{id}/matches/` - Get team matches

### Players
- `GET /api/player/live/{id}/` - Get player information
- `GET /api/player/live/{id}/matches/` - Get player matches

### Data Management
- `POST /api/sync/` - Sync data from Football-Data.org API

### Documentation
- `GET /api/docs/` - Swagger UI
- `GET /api/schema/` - OpenAPI schema

## cURL Examples with JWT

```bash
# Set your token
TOKEN="your_jwt_access_token_here"

# Get competitions
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/competitions/

# Get Premier League standings
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/competitions/live/PL/standings/

# Get live matches
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/matches/live/

# Sync data
curl -X POST -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/sync/

# Get team matches
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/teams/live/86/matches/
```

## Postman Collection

Import `JWT_Postman_Collection.json` for pre-configured JWT authentication.

## Environment Variables

- **base_url**: `http://localhost:8000`
- **FOOTBALL_API_KEY**: Your Football-Data.org API key in `.env`

## Response Codes

- **200**: Success with data
- **401**: Unauthorized (invalid/missing JWT token)
- **403**: Forbidden (valid token but insufficient permissions)
- **404**: Endpoint not found
- **500**: Server error (API key issues, external API errors)

## Competition Codes

Common competition codes for live endpoints:
- `PL` - Premier League
- `CL` - Champions League
- `BL1` - Bundesliga
- `SA` - Serie A
- `FL1` - Ligue 1
- `PD` - La Liga

## Testing Workflow

1. **Login**: Get JWT token
2. **Sync**: Populate database with latest data
3. **Browse**: Use database endpoints for fast access
4. **Live Data**: Use live API endpoints for real-time data
5. **Refresh**: Renew token when it expires (60 minutes)