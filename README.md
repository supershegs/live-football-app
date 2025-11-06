# Live Football App

A Django REST API backend with React TypeScript frontend for live football match data using Football-Data.org API.

## Setup Instructions

### 1. Get Football-Data.org API Key
1. Visit https://www.football-data.org/client/register
2. Register for a free account
3. Copy your API key

### 2. Backend Setup (Django)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Update .env file with your API key
# Edit .env and replace 'your-football-data-api-key-here' with your actual API key

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start Django server
python manage.py runserver
```

Backend will run on: http://localhost:8000

### 3. Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

Frontend will run on: http://localhost:3000

## API Endpoints

- `GET /api/competitions/` - List all competitions
- `GET /api/matches/` - List all matches
- `GET /api/matches/?competition=<id>` - Filter matches by competition
- `GET /api/live-matches/` - List live matches only
- `POST /api/sync/` - Sync data from Football-Data.org API

## API Documentation

- **Swagger UI**: http://localhost:8000/api/docs/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

## Usage

1. Start both backend and frontend servers
2. Open http://localhost:3000 in your browser
3. Click "Sync Data" to fetch latest match data
4. Use tabs to switch between "All Matches" and "Live Matches"
5. Filter matches by competition using the dropdown

## Features

- Live match tracking
- Competition filtering
- Real-time score updates
- Responsive design
- Django admin interface for data management

## Notes

- Free tier allows 10 requests/minute
- Data is cached in local database
- Sync manually or implement auto-refresh as needed