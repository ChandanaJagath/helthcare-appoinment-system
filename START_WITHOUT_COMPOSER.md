# Running Without Composer - Quick Guide

## ✅ Solution: Mock Backend Server

I've created a **Node.js mock API server** that works without Composer or PHP!

## Current Status

✅ **Frontend**: Running on http://localhost:5173  
✅ **Mock Backend**: Running on http://localhost:8000  
✅ **No Composer Required**: Uses Node.js only

## How to Use

### Start the Mock Backend (if not running)

```bash
cd mock-backend
npm install  # Only needed first time
npm start
```

The server will run on **http://localhost:8000**

### Access the Application

1. **Frontend**: Open http://localhost:5173 in your browser
2. **Backend API**: http://localhost:8000/api/health (should return `{"status":"ok"}`)

## Test Credentials

You can use these pre-configured accounts:

- **Patient**: 
  - Email: `patient@example.com`
  - Password: `password123`

- **Doctor**: 
  - Email: `doctor@example.com`
  - Password: `password123`

- **Admin**: 
  - Email: `admin@example.com`
  - Password: `password123`

Or register a new account through the frontend!

## Features

✅ User registration and login  
✅ JWT authentication  
✅ Appointment booking  
✅ Patient dashboard  
✅ Doctor dashboard  
✅ Admin panel  
✅ Mock data (resets on server restart)

## Notes

- **In-memory storage**: Data is stored in memory and resets when server restarts
- **Perfect for development**: Test the frontend without setting up Laravel
- **Same API structure**: Matches the Laravel backend endpoints
- **No database needed**: Everything runs in memory

## When You're Ready for Full Backend

If you want to use the full Laravel backend later:

1. Install Composer from https://getcomposer.org/
2. Follow the instructions in `QUICK_START.md`
3. The mock server can run alongside Laravel (on different ports)

## Troubleshooting

### Port 8000 Already in Use
- Stop any other services on port 8000
- Or change the port in `mock-backend/server.js` (line 7)

### Frontend Can't Connect
- Make sure mock backend is running: `netstat -ano | findstr :8000`
- Check browser console (F12) for errors
- Verify frontend is on http://localhost:5173

### Server Won't Start
- Make sure Node.js is installed: `node --version`
- Install dependencies: `cd mock-backend && npm install`
