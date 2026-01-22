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

## Deployment to Vercel

### Step 1: Set Root Directory in Vercel
1. Go to Vercel Dashboard: https://vercel.com/jagaths-projects-f1951148
2. Select your project: `helthcare-appoinment-system`
3. Go to **Settings** → **General**
4. Set **Root Directory** to: `frontend`
5. Click **Save**

### Step 2: Verify Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Environment Variables (Optional)
Add in Vercel Settings → Environment Variables:
- `VITE_API_BASE_URL`: Your backend API URL (e.g., `https://your-backend.com/api`)

### Step 4: Deploy
Vercel will automatically deploy when you push to GitHub, or click **Redeploy** in the Deployments tab.

## Project Structure

```
helthcare/
├── frontend/          # Vue.js frontend application
│   ├── src/
│   │   ├── views/    # Page components
│   │   ├── components/ # Reusable components
│   │   ├── services/ # API services
│   │   └── store/    # Vuex state management
│   ├── vercel.json   # Vercel configuration
│   └── package.json
├── mock-backend/     # Node.js mock API server
│   ├── server.js     # Express server
│   └── package.json
└── README.md
```

## Notes

- This is a mock backend for development purposes
- All data is stored in memory (resets on server restart)
- For production, replace with a real database backend

## License

MIT
