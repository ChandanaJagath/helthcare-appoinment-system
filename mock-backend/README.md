# Healthcare Backend API Server

A Node.js/Express API server with MySQL database for the Healthcare Appointment System.

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v5.7 or higher, or MariaDB)
- npm

## Quick Start

### 1. Install Dependencies
```bash
cd mock-backend
npm install
```

### 2. Configure Database

Create a `.env` file in the `mock-backend` directory (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` and set your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=healthcare_db
DB_PORT=3307
JWT_SECRET=your-secret-key-change-in-production
PORT=8000
```

### 3. Initialize Database

Run the database initialization script to create tables and seed initial data:
```bash
npm run db:init
```

This will:
- Create the database and tables
- Seed initial users (patient, doctor, admin)
- Seed doctor profiles

### 4. Start the Server
```bash
npm start
```

The server will run on **http://localhost:8000**

## Database Schema

The database includes three main tables:

- **users** - User accounts (patients, doctors, admins)
- **doctors** - Doctor profiles linked to users
- **appointments** - Appointment bookings

See `database/schema.sql` for the complete schema definition.

## Features

- ✅ MySQL database persistence
- ✅ JWT Authentication with password hashing (bcrypt)
- ✅ User registration and login
- ✅ Appointment management API
- ✅ Patient, Doctor, and Admin endpoints
- ✅ CORS enabled for frontend
- ✅ Connection pooling for performance

## Test Credentials

After running `npm run db:init`, you can use these credentials:

- **Patient**: `patient@example.com` / `password123`
- **Doctor**: `doctor@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/available-slots` - Get available time slots

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/dashboard` - Get doctor dashboard data
- `GET /api/doctors/appointments` - Get doctor's appointments
- `GET /api/doctors/patients/:id` - Get patient details

### Patients
- `GET /api/patients/appointments` - Get patient's appointments
- `GET /api/patients/medical-records` - Get medical records
- `GET /api/patients/prescriptions` - Get prescriptions

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/appointments` - Get all appointments

## Project Structure

```
mock-backend/
├── config/
│   └── database.js          # MySQL connection pool
├── database/
│   ├── schema.sql           # Database schema
│   └── init.js              # Database initialization script
├── models/
│   ├── userModel.js         # User model
│   ├── doctorModel.js       # Doctor model
│   └── appointmentModel.js  # Appointment model
├── .env.example             # Environment variables template
├── server.js                # Express server
├── package.json             # Dependencies
└── README.md                # This file
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | (required) |
| `DB_NAME` | Database name | `healthcare_db` |
| `DB_PORT` | MySQL port | `3307` |
| `JWT_SECRET` | JWT secret key | (change in production!) |
| `PORT` | Server port | `8000` |

## Notes

- Passwords are hashed using bcrypt before storing in the database
- Database connection uses connection pooling for better performance
- Foreign key constraints ensure data integrity
- All timestamps are automatically managed by MySQL

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Verify database credentials in `.env`
- Check if database exists (run `npm run db:init`)

### Port Already in Use
- Change `PORT` in `.env` file
- Or stop the process using port 8000

### Module Not Found
- Run `npm install` to install dependencies
