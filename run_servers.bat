@echo off
echo Starting Live Football App...

echo.
echo Starting Django backend server...
start cmd /k "cd backend && python manage.py runserver"

echo.
echo Waiting 5 seconds before starting frontend...
timeout /t 5 /nobreak > nul

echo Starting React frontend server...
start cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul