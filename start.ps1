Write-Host "Starting Healthcare Appointment System..." -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "Starting Backend Server on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\mock-backend'; node server.js"

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend Server on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Servers are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Servers are running in separate windows." -ForegroundColor Green
Write-Host "Close those windows to stop the servers." -ForegroundColor Yellow
