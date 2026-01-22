# Deployment Guide

This guide explains how to deploy the Healthcare Appointment System to GitHub and Vercel.

## Project Structure

```
helthcare/
├── frontend/          # Vue.js frontend application
├── mock-backend/      # Node.js mock API server (for development)
├── .gitignore         # Git ignore rules
├── vercel.json        # Vercel deployment configuration
└── README.md          # Project documentation
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git account
- Vercel account (free tier available)

## Step 1: Prepare for GitHub

### 1.1 Initialize Git Repository (if not already done)

```bash
cd c:\Users\Administrator\Desktop\projects\helthcare
git init
git add .
git commit -m "Initial commit: Healthcare Appointment System"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `healthcare-appointment-system` (or your preferred name)
3. **Don't** initialize with README, .gitignore, or license (we already have these)

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/healthcare-appointment-system.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Vercel (Optional)

If you want to deploy the mock-backend separately:

### Option A: Deploy Backend as Serverless Functions

1. Create a new Vercel project for the backend
2. Update `mock-backend/server.js` to work as serverless functions
3. Deploy to Vercel

### Option B: Use External Backend Service

- Deploy backend to services like:
  - Railway
  - Render
  - Heroku
  - AWS
  - Or use your own server

## Step 3: Deploy Frontend to Vercel

### 3.1 Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 3.2 Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3.3 Environment Variables

In Vercel dashboard, go to Project Settings → Environment Variables and add:

```
VITE_API_BASE_URL=https://your-backend-api-url.com/api
```

**Important**: Replace `your-backend-api-url.com` with your actual backend API URL.

### 3.4 Deploy

Click "Deploy" and wait for the build to complete.

## Step 4: Configure API Endpoint

After deployment, update the environment variable in Vercel:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add/Update: `VITE_API_BASE_URL` with your backend API URL
4. Redeploy the application

## Step 5: Access Your Application

Once deployed, Vercel will provide you with:
- Production URL: `https://your-project.vercel.app`
- Preview URLs for each deployment

## Alternative: Deploy Backend to Vercel as Serverless

If you want to deploy the mock-backend to Vercel:

1. Create `api/` folder in the root
2. Convert Express routes to Vercel serverless functions
3. Update `vercel.json` to handle API routes

## Troubleshooting

### Build Fails

- Check that all dependencies are in `package.json`
- Ensure Node.js version is compatible (v16+)
- Check build logs in Vercel dashboard

### API Calls Fail

- Verify `VITE_API_BASE_URL` environment variable is set correctly
- Check CORS settings on your backend
- Ensure backend is accessible from the internet

### Routing Issues

- Vercel automatically handles SPA routing with the `vercel.json` configuration
- If routes don't work, check the `rewrites` section in `vercel.json`

## Local Development

To run locally:

```bash
# Terminal 1: Start Backend
cd mock-backend
npm install
node server.js

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:5173`
Backend will be available at: `http://localhost:8000`

## Production Checklist

- [ ] Environment variables configured
- [ ] Backend API is deployed and accessible
- [ ] CORS is properly configured on backend
- [ ] All API endpoints are working
- [ ] Frontend builds successfully
- [ ] All routes work correctly
- [ ] Authentication flow works
- [ ] Error handling is in place

## Support

For issues or questions:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify environment variables
4. Test API endpoints directly
