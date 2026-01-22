# 🔧 Backend Deployment Required

## The Problem

Your frontend is deployed on Vercel, but the backend is only running locally. When users try to login from the Vercel deployment, they get "Login failed" because the backend API is not accessible.

## Solution Options

### Option 1: Deploy Backend to a Hosting Service (Recommended)

Deploy your `mock-backend` to a service that supports Node.js:

#### Using Railway (Free tier available)
1. Go to https://railway.app
2. Create new project
3. Connect your GitHub repo
4. Select `mock-backend` folder as root
5. Railway will auto-detect Node.js and deploy
6. Get the deployment URL (e.g., `https://your-backend.railway.app`)
7. Add to Vercel Environment Variables:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-backend.railway.app/api`

#### Using Render (Free tier available)
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Set:
   - Root Directory: `mock-backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Get the deployment URL
6. Add to Vercel Environment Variables as above

#### Using Heroku
1. Install Heroku CLI
2. `cd mock-backend`
3. `heroku create your-backend-name`
4. `git push heroku main`
5. Add environment variable in Vercel

### Option 2: Use Local Backend (Development Only)

For local development:
1. Start backend: `cd mock-backend && node server.js`
2. Start frontend: `cd frontend && npm run dev`
3. Frontend will use proxy to `http://localhost:8000`

### Option 3: Use Mock Service Worker (For Demo)

For a demo without backend, you could use MSW (Mock Service Worker) to intercept API calls, but this requires code changes.

## Current Status

- ✅ Frontend: Deployed on Vercel
- ❌ Backend: Only runs locally (not accessible from Vercel)
- ❌ API Connection: Failing because backend is not deployed

## Quick Fix for Testing

1. **Deploy backend** to Railway/Render/Heroku
2. **Get backend URL** (e.g., `https://your-backend.railway.app`)
3. **Add to Vercel Environment Variables**:
   - Go to: Vercel Dashboard → Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend.railway.app/api`
4. **Redeploy** frontend on Vercel

## Environment Variable Setup

In Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-deployed-backend-url.com/api`
   - **Environment**: Production, Preview, Development
4. Redeploy

---

**The backend MUST be deployed for the Vercel deployment to work!**
