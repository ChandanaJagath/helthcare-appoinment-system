# Quick Fix Guide

## ✅ All Issues Fixed

### 1. Router Guard Fixed
- Fixed potential navigation issues in router guard
- Added proper return statements to prevent multiple redirects
- Improved authentication and role checking logic

### 2. Startup Scripts Created
- `start.bat` - Windows batch file to start both servers
- `start.ps1` - PowerShell script to start both servers

## How to Run

### Option 1: Use Startup Scripts (Easiest)

**Windows:**
```bash
# Double-click start.bat or run in terminal:
start.bat
```

**PowerShell:**
```powershell
.\start.ps1
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd mock-backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Verify It's Working

1. **Backend**: Open http://localhost:8000/api/health
   - Should return: `{"status":"ok"}`

2. **Frontend**: Open http://localhost:5173
   - Should show the login page
   - No console errors

## Default Login Credentials

- **Admin**: `admin@example.com` / `password123`
- **Doctor**: `doctor@example.com` / `password123`
- **Patient**: `patient@example.com` / `password123`

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Module Not Found
```bash
cd frontend
rm -rf node_modules
npm install
```

### Backend Not Running
- Check if backend is running on port 8000
- Verify `mock-backend/server.js` exists
- Run: `cd mock-backend && node server.js`

## Current Status

✅ Frontend: Running on http://localhost:5173
✅ Backend: Running on http://localhost:8000
✅ Router: Fixed and working
✅ Build: Successful
✅ All dependencies: Installed

## Next Steps

1. Open http://localhost:5173 in your browser
2. Login with one of the default credentials
3. Test the application features
