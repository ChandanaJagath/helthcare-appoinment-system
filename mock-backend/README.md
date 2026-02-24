# Healthcare Backend API Server

A Node.js/Express API server with **PostgreSQL** (Neon or local) for the Healthcare Appointment System.

## Prerequisites

- Node.js (v16 or higher)
- **PostgreSQL** database: [Neon](https://neon.tech) (recommended, free tier) or local PostgreSQL
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

**Option A – Neon (recommended)**  
1. Create a free project at [neon.tech](https://neon.tech).  
2. Copy the connection string from the Neon dashboard.  
3. In `.env` set:
```env
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-secret-key-change-in-production
PORT=8000
```

**Option B – Local PostgreSQL**  
In `.env` set:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=healthcare_db
DB_PORT=5432
JWT_SECRET=your-secret-key-change-in-production
PORT=8000
```

### 3. Initialize Database

Run the database initialization script to create tables and seed initial data:
```bash
npm run db:init
```

This will:
- Create the tables in your PostgreSQL database
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

- ✅ PostgreSQL database (Neon or local)
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
│   └── database.js          # PostgreSQL connection pool
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
| `DATABASE_URL` | **Neon/PostgreSQL connection string** (recommended) | — |
| `DB_HOST` | PostgreSQL host (if not using DATABASE_URL) | `localhost` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | — |
| `DB_NAME` | Database name | `healthcare_db` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `JWT_SECRET` | JWT secret key | (change in production!) |
| `PORT` | Server port | `8000` |

## Notes

- Passwords are hashed using bcrypt before storing in the database
- Database connection uses connection pooling for better performance
- Foreign key constraints ensure data integrity
- All timestamps are automatically managed by PostgreSQL

## Troubleshooting

### Server works first time, then "won't start" or "address already in use" on next run

**Cause:** If you close the terminal window without stopping the server (e.g. without pressing **Ctrl+C**), the Node process keeps running in the background and keeps using port 8000. The next time you run `npm start`, port 8000 is still in use, so the new server cannot start.

**Fix:**

1. **Always stop the server with Ctrl+C** in the terminal before closing it.
2. If you already closed it and port 8000 is in use, free the port before starting again:

   **Windows (PowerShell, run as Administrator if needed):**
   ```powershell
   Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
   ```
   Then run `npm start` again from `mock-backend`.

   **Windows (Command Prompt):** Find the process ID (PID) using port 8000, then kill it:
   ```cmd
   netstat -ano | findstr :8000
   taskkill /PID <PID_from_above> /F
   ```

### Database Connection Error
- **Neon:** Ensure `DATABASE_URL` in `.env` is correct (copy from Neon dashboard; include `?sslmode=require`).
- **Local:** Ensure PostgreSQL is running; verify `DB_*` credentials in `.env`.
- Run `npm run db:init` to create tables and seed data.

### Port Already in Use
- Change `PORT` in `.env` file (e.g. to 8001), or
- Stop the process using port 8000 (see "Server works first time, then..." above).

### Module Not Found
- Run `npm install` to install dependencies
