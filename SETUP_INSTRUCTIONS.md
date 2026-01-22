# Setup Instructions

## Frontend (Vue.js)

The frontend development server should now be running. Access it at:
- **URL**: http://localhost:5173

If you need to restart it:
```bash
cd frontend
npm run dev
```

## Backend (Laravel)

To run the backend API, you need to:

### 1. Install Composer Dependencies

First, ensure you have Composer installed. If not, download it from https://getcomposer.org/

Then run:
```bash
cd backend
composer install
```

### 2. Configure Environment

Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Or manually create `.env` file with these settings:
```env
APP_NAME="Healthcare Appointment System"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=healthcare_db
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
STRIPE_KEY=
STRIPE_SECRET=
FRONTEND_URL=http://localhost:5173
```

### 3. Generate Keys

```bash
php artisan key:generate
php artisan jwt:secret
```

### 4. Set Up Database

Create a MySQL database named `healthcare_db`, then run migrations:
```bash
php artisan migrate
```

### 5. Start Queue Worker (for notifications)

In a separate terminal:
```bash
cd backend
php artisan queue:work
```

### 6. Start Laravel Server

```bash
cd backend
php artisan serve
```

The backend API will be available at:
- **URL**: http://localhost:8000
- **API Base**: http://localhost:8000/api

## Quick Start Checklist

- [x] Frontend dependencies installed
- [x] Frontend dev server running (http://localhost:5173)
- [ ] Backend dependencies installed (composer install)
- [ ] Backend .env configured
- [ ] Backend keys generated
- [ ] Database created and migrated
- [ ] Backend server running (http://localhost:8000)
- [ ] Queue worker running

## Testing the Application

1. Open http://localhost:5173 in your browser
2. Register a new account (choose Patient, Doctor, or Admin role)
3. Login with your credentials
4. Navigate through the dashboard based on your role

## Troubleshooting

### Frontend Issues
- If port 5173 is in use, Vite will automatically use the next available port
- Check browser console for errors
- Ensure backend API is running and accessible

### Backend Issues
- Ensure PHP 8.1+ is installed
- Ensure MySQL is running
- Check Laravel logs: `backend/storage/logs/laravel.log`
- Verify database connection in `.env`

### CORS Issues
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check `backend/config/cors.php` configuration
