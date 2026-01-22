# Quick Start Guide

## Current Issue
The frontend is running on **localhost:8080**, but the backend API on **localhost:8000** is not running.

## Solution Options

### Option 1: Start the Backend (Recommended)

The backend requires **Composer** (PHP dependency manager). Here's how to set it up:

#### Step 1: Install Composer
1. Download Composer from: https://getcomposer.org/download/
2. Run the Windows installer
3. Verify installation: Open PowerShell and run `composer --version`

#### Step 2: Set Up Backend
```bash
# Navigate to backend folder
cd backend

# Install dependencies
composer install

# Create .env file (copy from .env.example)
copy .env.example .env

# Generate application key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Create database (in MySQL)
# Create a database named: healthcare_db

# Run migrations
php artisan migrate

# Start the server
php artisan serve
```

The backend will run on **http://localhost:8000**

#### Step 3: Start Queue Worker (for notifications)
Open a new terminal:
```bash
cd backend
php artisan queue:work
```

### Option 2: Use Frontend Only (Limited Functionality)

The frontend will work and show the UI, but:
- Login/Registration won't work (needs backend)
- API calls will fail
- You can see the UI structure and design

The frontend is already running on **http://localhost:8080**

## Verify Everything is Working

1. **Frontend**: Open http://localhost:8080 - You should see the login page
2. **Backend**: Open http://localhost:8000/api/health - Should return `{"status":"ok"}`
3. **Full System**: Try registering a new account on the frontend

## Troubleshooting

### "Composer not found"
- Make sure Composer is installed and in your PATH
- Restart your terminal after installing Composer

### "PHP not found"
- Install PHP 8.1+ from https://windows.php.net/download/
- Add PHP to your system PATH

### "Database connection failed"
- Make sure MySQL is running
- Check database credentials in `backend/.env`
- Create the database: `CREATE DATABASE healthcare_db;`

### Port Already in Use
- If port 8000 is busy, Laravel will show an error
- Kill the process using port 8000 or change the port in `.env`

## Current Status

✅ Frontend: Running on http://localhost:8080  
❌ Backend: Not running (needs Composer setup)  
⏳ Database: Needs to be created  
⏳ Queue Worker: Needs to be started after backend is running
