@echo off
echo Setting up Django backend...

cd backend

echo Installing dependencies...
pip install -r requirements.txt

echo Running migrations...
python manage.py migrate

echo Creating superuser (create username and password for you JWT)...
python manage.py createsuperuser

echo Setup complete! Run 'python manage.py runserver' to start the server.