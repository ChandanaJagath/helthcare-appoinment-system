# Mock Backend API Server

A simple Node.js/Express mock API server that doesn't require Composer or PHP.

## Quick Start

### 1. Install Dependencies
```bash
cd mock-backend
npm install
```

### 2. Start the Server
```bash
npm start
```

The server will run on **http://localhost:8000**

## Features

- ✅ JWT Authentication
- ✅ User registration and login
- ✅ Mock appointments API
- ✅ Patient, Doctor, and Admin endpoints
- ✅ CORS enabled for frontend
- ✅ No Composer/PHP required

## Test Credentials

- **Patient**: `patient@example.com` / `password123`
- **Doctor**: `doctor@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`

## API Endpoints

All endpoints match the Laravel backend structure:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- And more...

## Notes

- This is a **mock server** with in-memory data (data resets on restart)
- Perfect for frontend development and testing
- No database required
- All data is stored in memory
