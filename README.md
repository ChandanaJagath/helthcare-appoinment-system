# Healthcare Appointment System

A modern healthcare appointment management system with patient, doctor, and admin dashboards.

## Features

- **User Roles**: Patient, Doctor, and Admin with separate dashboards
- **Appointment Booking**: Easy appointment scheduling with calendar view
- **Dashboard Analytics**: Comprehensive statistics and insights
- **Patient Management**: Medical records and appointment history
- **Doctor Dashboard**: Today's queue, upcoming appointments, patient details
- **Admin Panel**: User management, appointments overview, system settings

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

2. **Install Backend Dependencies**
```bash
cd mock-backend
npm install
```

### Running the Application

1. **Start Backend Server** (Terminal 1)
```bash
cd mock-backend
node server.js
```
Backend runs on: `http://localhost:8000`

2. **Start Frontend Server** (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

3. **Open Browser**
Navigate to: `http://localhost:5173`

## Default Login Credentials

### Admin
- Email: `admin@example.com`
- Password: `password123`

### Doctor
- Email: `doctor@example.com`
- Password: `password123`

### Patient
- Email: `patient@example.com`
- Password: `password123`

Or register a new account from the login page.

## Tech Stack

- **Frontend**: Vue.js 3, Vue Router, Vuex, Vite
- **Backend**: Node.js, Express
- **Authentication**: JWT

## Project Structure

```
helthcare/
├── frontend/          # Vue.js frontend application
│   ├── src/
│   │   ├── views/    # Page components
│   │   ├── components/ # Reusable components
│   │   ├── services/ # API services
│   │   └── store/    # Vuex state management
│   └── package.json
├── mock-backend/     # Node.js mock API server
│   ├── server.js     # Express server
│   └── package.json
└── README.md
```

## Features Overview

### Patient Dashboard
- Book appointments
- View appointment history
- Medical records
- Profile management

### Doctor Dashboard
- Today's appointments queue
- Upcoming appointments
- Patient details and medical records
- Schedule management

### Admin Dashboard
- User management
- Appointments overview
- System statistics
- Settings

## Deployment

### Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_BASE_URL` (your backend API URL)
5. Deploy!

### Environment Variables

For production, set these environment variables:

- `VITE_API_BASE_URL`: Your backend API URL (e.g., `https://api.example.com/api`)

## Project Structure

```
helthcare/
├── frontend/              # Vue.js frontend application
│   ├── src/
│   │   ├── views/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── services/     # API services
│   │   ├── store/        # Vuex state management
│   │   ├── router/       # Vue Router configuration
│   │   └── layouts/      # Layout components
│   ├── public/           # Static assets
│   ├── dist/             # Build output (generated)
│   ├── package.json
│   ├── vite.config.js    # Vite configuration
│   └── vercel.json       # Vercel deployment config
├── mock-backend/         # Node.js mock API server
│   ├── server.js         # Express server
│   └── package.json
├── .github/
│   └── workflows/        # GitHub Actions workflows
├── .gitignore            # Git ignore rules
├── vercel.json           # Root Vercel config
├── DEPLOYMENT.md         # Deployment guide
└── README.md             # This file
```

## Notes

- This is a mock backend for development purposes
- All data is stored in memory (resets on server restart)
- For production, replace with a real database backend
- Frontend is configured to work with environment variables for API URLs

## Troubleshooting

### Frontend won't start
- Check if port 5173 is available
- Run `npm install` in the frontend directory
- Check Node.js version (requires v16+)

### API calls fail
- Ensure backend is running on port 8000
- Check `VITE_API_BASE_URL` environment variable
- Verify CORS settings on backend

### Build errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript/ESLint errors
- Verify all dependencies are installed

## License

MIT
