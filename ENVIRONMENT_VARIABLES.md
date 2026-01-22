# Environment Variables Guide

## Required Environment Variables for Vercel Deployment

### VITE_API_BASE_URL

**Description**: The base URL for your backend API server.

**Required**: Yes (for production)

**Format**: Full URL including protocol and `/api` path

**Examples**:
```
# Development (local)
VITE_API_BASE_URL=http://localhost:8000/api

# Production (Railway)
VITE_API_BASE_URL=https://your-app.railway.app/api

# Production (Render)
VITE_API_BASE_URL=https://your-app.onrender.com/api

# Production (Custom Domain)
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

**How to Set in Vercel**:
1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: Your backend API URL (e.g., `https://your-backend.railway.app/api`)
   - **Environment**: Production, Preview, Development (select all)
5. Click **Save**
6. **Redeploy** your application

## Environment-Specific Configuration

### Development (Local)

Create `frontend/.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_ENV=development
```

### Production (Vercel)

Set in Vercel Dashboard:
```
VITE_API_BASE_URL=https://your-backend-api-url.com/api
```

## How It Works

The application checks for `VITE_API_BASE_URL` environment variable:

1. **If set**: Uses the provided URL for all API calls
2. **If not set**: Falls back to `/api` (proxy mode for development)

This allows:
- **Development**: Use Vite proxy to `http://localhost:8000`
- **Production**: Use full URL to your deployed backend

## Backend CORS Configuration

Your backend must allow requests from your Vercel domain. Update `mock-backend/server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',                    // Local development
    'https://helthcare-appoinment-system.vercel.app',  // Production
    'https://*.vercel.app'                      // All Vercel preview deployments
  ],
  credentials: true
}));
```

## Testing Environment Variables

### Local Testing

```bash
# Set environment variable
$env:VITE_API_BASE_URL="https://your-api.com/api"

# Run dev server
cd frontend
npm run dev
```

### Verify in Browser

1. Open browser DevTools (F12)
2. Go to Console
3. Check network requests - they should use the correct API URL
4. Check for CORS errors

## Troubleshooting

### API Calls Fail After Deployment

**Check:**
1. Environment variable is set correctly in Vercel
2. Backend is accessible from the internet
3. CORS is configured on backend
4. Backend URL doesn't have trailing slash (use `/api` not `/api/`)

### Environment Variable Not Working

**Common Issues:**
1. Variable name must start with `VITE_` for Vite to expose it
2. Must redeploy after adding/changing environment variables
3. Check build logs in Vercel to verify variable is available

### CORS Errors

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**: Update backend CORS configuration to include your Vercel domain

## Quick Reference

| Environment | Variable | Value Example |
|-------------|----------|--------------|
| Local Dev | `VITE_API_BASE_URL` | `http://localhost:8000/api` |
| Vercel Prod | `VITE_API_BASE_URL` | `https://api.example.com/api` |

## Security Notes

- ⚠️ Never commit `.env` files to Git (already in `.gitignore`)
- ✅ Use Vercel's environment variables for production secrets
- ✅ Use different API URLs for development and production
- ✅ Keep backend API keys secure (not in frontend code)
