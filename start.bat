@echo off
echo Starting Healthcare Appointment System...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0mock-backend && node server.js"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo Servers are starting...
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit (servers will continue running)...
pause >nul
