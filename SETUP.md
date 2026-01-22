# Setup Instructions

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/healthcare-appointment-system.git
cd healthcare-appointment-system
```

### 2. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
cd ..
```

#### Backend
```bash
cd mock-backend
npm install
cd ..
```

### 3. Environment Configuration

#### Frontend Environment Variables

Create `frontend/.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_ENV=development
```

For production, update `VITE_API_BASE_URL` to your production API URL.

### 4. Run the Application

#### Development Mode

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

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

#### Production Build

```bash
cd frontend
npm run build
npm run preview
```

## Common Issues

### Port Already in Use

If port 5173 is in use:
- Change port in `frontend/vite.config.js`
- Or kill the process using the port

### Module Not Found Errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### API Connection Errors

1. Verify backend is running
2. Check `VITE_API_BASE_URL` in `.env`
3. Verify CORS is enabled on backend

## Next Steps

- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- See [README.md](./README.md) for project overview
