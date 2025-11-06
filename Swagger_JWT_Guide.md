# Swagger JWT Authentication Guide

## JWT Integration Complete

JWT authentication has been fully integrated into Swagger documentation.

## Swagger UI Features

### 1. Authentication Endpoints
- **Login**: `POST /api/auth/token/` - Get JWT tokens
- **Refresh**: `POST /api/auth/token/refresh/` - Refresh access token

### 2. Security Scheme
- **Type**: HTTP Bearer
- **Scheme**: Bearer
- **Format**: JWT

### 3. Using Swagger UI

#### Step 1: Login
1. Go to `/api/docs/`
2. Find "Login" endpoint
3. Click "Try it out"
4. Enter credentials:
   ```json
   {
     "username": "your_username",
     "password": "your_password"
   }
   ```
5. Copy the `access` token from response

#### Step 2: Authorize
1. Click "Authorize" button (🔒) at top of Swagger UI
2. Enter: `Bearer YOUR_ACCESS_TOKEN`
3. Click "Authorize"

#### Step 3: Test Protected Endpoints
- All endpoints now show 🔒 lock icon
- Requests automatically include JWT token
- Test any endpoint directly from Swagger UI

## Security Documentation

All protected endpoints now show:
- 🔒 Security requirement indicator
- JWT Bearer authentication in request headers
- Proper 401 Unauthorized responses for invalid tokens

## Token Management

- **Access Token**: Valid for 60 minutes
- **Refresh Token**: Valid for 7 days
- Use refresh endpoint when access token expires

## Example Usage

1. **Create User**: `python manage.py createsuperuser`
2. **Access Swagger**: http://localhost:8000/api/docs/
3. **Login via Swagger**: Use login endpoint
4. **Authorize**: Click authorize button, enter token
5. **Test APIs**: All endpoints now authenticated