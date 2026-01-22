# Frontend - Healthcare Appointment System

## How to Run

**IMPORTANT:** Do NOT open `index.html` directly in the browser!

### Start the Development Server

```bash
cd frontend
npm install  # Only needed first time
npm run dev
```

### Access the Application

Open your browser and go to:
**http://localhost:8080**

The dev server will automatically:
- Compile Vue.js components
- Handle module imports
- Provide hot module replacement (HMR)
- Proxy API requests to backend

## Why Not Open index.html Directly?

Opening `index.html` as a file (`file://`) won't work because:
- ES modules (`type="module"`) don't work with `file://` protocol
- Vite needs to serve files to handle bundling
- Relative paths won't resolve correctly
- No hot reload or development features

## Troubleshooting

### Port Already in Use
If port 8080 is busy, Vite will automatically use the next available port (8081, 8082, etc.)

### Blank Page
- Make sure you're accessing via `http://localhost:8080`, not `file://`
- Check browser console (F12) for errors
- Verify the dev server is running: `netstat -ano | findstr :8080`

### API Connection Errors
- Backend must be running on `http://localhost:8000`
- Check `vite.config.js` proxy settings
- See `QUICK_START.md` for backend setup
