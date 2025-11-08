# Frontend Integration Guide

## Overview
The frontend has been completely integrated with all backend services including JWT authentication and comprehensive API endpoints.

## New Features Added

### 1. JWT Authentication
- Login component with username/password
- Automatic token refresh
- Protected routes
- Logout functionality

### 2. Navigation System
- Multi-tab interface
- Matches, Competitions, Teams, Live Data tabs
- Clean navigation with logout option

### 3. Comprehensive API Integration
- All backend endpoints integrated
- Live competitions data
- Team details and matches
- Player information
- Football areas
- Head-to-head statistics
- Real-time match data

### 4. Enhanced UI/UX
- Professional styling with CSS classes
- Responsive design
- Loading states
- Error handling
- Data visualization

## Setup Instructions

### 1. Backend Setup (if not done)
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 3. First Time Usage
1. Start both backend (port 8000) and frontend (port 3000)
2. Open http://localhost:3000
3. Login with superuser credentials created in backend setup
4. Navigate through different tabs to explore features

## Available Features

### Matches Tab
- View all matches from local database
- Filter by competition
- View live matches only
- Sync data from Football-Data.org API

### Competitions Tab
- Browse live competitions from API
- View competition details, standings, matches, teams, scorers
- Real-time data from Football-Data.org

### Teams Tab
- Browse teams from API
- View team details and match history
- Team-specific information

### Live Data Tab
- Direct API calls to Football-Data.org
- Live matches data
- Match details and head-to-head statistics
- Football areas information

## API Endpoints Integrated

### Authentication
- `POST /api/auth/token/` - Login
- `POST /api/auth/token/refresh/` - Refresh token

### Competitions
- `GET /api/competitions/` - Local competitions
- `GET /api/competitions/live/` - Live competitions
- `GET /api/competitions/live/{code}/` - Competition details
- `GET /api/competitions/live/{code}/standings/` - Standings
- `GET /api/competitions/live/{code}/matches/` - Competition matches
- `GET /api/competitions/live/{code}/teams/` - Competition teams
- `GET /api/competitions/live/{code}/scorers/` - Top scorers

### Matches
- `GET /api/matches/` - Local matches
- `GET /api/live-matches/` - Local live matches
- `GET /api/matches/live/` - Live matches from API
- `GET /api/matches/live/{id}/` - Match details
- `GET /api/matches/live/{id}/head2head/` - Head-to-head

### Teams
- `GET /api/teams/live/` - Live teams
- `GET /api/teams/live/{id}/` - Team details
- `GET /api/teams/live/{id}/matches/` - Team matches

### Players
- `GET /api/player/live/{id}/` - Player details
- `GET /api/player/live/{id}/matches/` - Player matches

### Areas
- `GET /api/football-areas/live/` - Football areas
- `GET /api/football-areas/live/{id}/` - Area details

### Data Management
- `POST /api/sync/` - Sync data from Football-Data.org

## Technical Implementation

### Authentication Flow
1. User logs in with credentials
2. JWT tokens stored in localStorage
3. Automatic token refresh on expiry
4. All API calls include Bearer token
5. Redirect to login on authentication failure

### State Management
- React hooks for state management
- Separate states for different data types
- Loading states for better UX
- Error handling throughout

### Component Structure
```
src/
├── components/
│   ├── Login.tsx - Authentication
│   ├── Navigation.tsx - Tab navigation
│   ├── MatchCard.tsx - Match display
│   ├── CompetitionFilter.tsx - Competition filtering
│   ├── CompetitionsTab.tsx - Competition management
│   ├── TeamsTab.tsx - Team management
│   └── LiveDataTab.tsx - Live API data
├── services/
│   └── api.ts - All API calls
├── types/
│   └── index.ts - TypeScript interfaces
├── App.tsx - Main application
├── App.css - Styling
└── index.tsx - Entry point
```

## Usage Tips

1. **First Login**: Use the superuser credentials you created during backend setup
2. **Data Sync**: Click "Sync Data" in Matches tab to fetch latest data from Football-Data.org
3. **Live Data**: Use the Live Data tab to get real-time information directly from the API
4. **Competition Codes**: Use codes like 'PL' (Premier League), 'CL' (Champions League), etc.
5. **Match IDs**: Get match IDs from the matches list to view detailed information

## Troubleshooting

### Authentication Issues
- Ensure backend is running on port 8000
- Check superuser credentials
- Clear localStorage if needed: `localStorage.clear()`

### API Errors
- Verify Football-Data.org API key in backend .env file
- Check API rate limits (10 requests/minute for free tier)
- Ensure backend migrations are applied

### CORS Issues
- Backend should have CORS configured for localhost:3000
- Check Django CORS settings

## Next Steps

The frontend now provides complete integration with all backend services. You can:
1. Customize the UI further
2. Add more detailed data visualization
3. Implement real-time updates with WebSockets
4. Add user preferences and settings
5. Implement caching for better performance