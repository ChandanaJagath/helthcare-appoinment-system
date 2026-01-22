# Vercel Deployment Guide

Complete step-by-step guide to deploy the Healthcare Appointment System to Vercel.

## Prerequisites

- ✅ GitHub repository: https://github.com/ChandanaJagath/helthcare-appoinment-system.git
- ✅ Vercel account: https://vercel.com/jagaths-projects-f1951148
- ✅ Node.js installed locally (for testing)

## Step 1: Verify GitHub Repository

Your code should already be on GitHub. Verify:
```bash
git remote -v
# Should show: https://github.com/ChandanaJagath/helthcare-appoinment-system.git
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/jagaths-projects-f1951148
   - Or go to: https://vercel.com/dashboard

2. **Add New Project**
   - Click "Add New..." → "Project"
   - Or click "Import Project"

3. **Import GitHub Repository**
   - Select "Import Git Repository"
   - Choose: `ChandanaJagath/helthcare-appoinment-system`
   - Click "Import"

4. **Configure Project Settings**
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `frontend` ⚠️ **IMPORTANT**
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `dist` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

5. **Environment Variables**
   - Click "Environment Variables"
   - Add the following:
     ```
     Name: VITE_API_BASE_URL
     Value: https://your-backend-api-url.com/api
     ```
   - ⚠️ **Important**: Replace `your-backend-api-url.com` with your actual backend API URL
   - For now, you can use a placeholder or leave it empty (will use proxy in dev)

6. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 1-2 minutes)

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No (first time) or Yes (if redeploying)
# - Project name? healthcare-appointment-system (or your choice)
# - Directory? ./
# - Override settings? No
```

## Step 3: Configure Environment Variables

After initial deployment:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add/Update:
   - **VITE_API_BASE_URL**: Your backend API URL
     - Example: `https://your-backend.railway.app/api`
     - Example: `https://your-backend.render.com/api`
     - Example: `https://api.yourdomain.com/api`

4. **Redeploy** after adding environment variables:
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Click "Redeploy"

## Step 4: Verify Deployment

1. **Check Build Logs**
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Check "Build Logs" for any errors

2. **Test Your Application**
   - Visit your deployment URL (e.g., `https://helthcare-appoinment-system.vercel.app`)
   - Test login functionality
   - Check browser console for errors

## Step 5: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

**Error: Module not found**
```bash
# Solution: Ensure all dependencies are in package.json
cd frontend
npm install
npm run build
```

**Error: Port already in use**
- This shouldn't happen in Vercel, but if it does locally:
```bash
# Check what's using the port
netstat -ano | findstr :5173
```

### Application Doesn't Load

**Check:**
1. Environment variables are set correctly
2. Backend API is accessible
3. CORS is enabled on backend
4. Browser console for errors

### API Calls Fail

**Common Issues:**
1. **CORS Error**: Backend needs to allow requests from Vercel domain
2. **Wrong API URL**: Check `VITE_API_BASE_URL` environment variable
3. **Backend Not Running**: Ensure backend is deployed and accessible

**Fix CORS on Backend:**
```javascript
// In mock-backend/server.js
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-vercel-app.vercel.app',
    'https://*.vercel.app' // Allow all Vercel preview deployments
  ],
  credentials: true
}));
```

### Routing Issues (404 on Refresh)

**Solution:** The `vercel.json` file should handle this automatically with rewrites:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

If routing still doesn't work:
1. Verify `vercel.json` is in the `frontend/` directory
2. Check that Vercel detected it correctly in build logs

## Project Structure for Vercel

```
helthcare/
├── frontend/              # ⚠️ This is the root directory for Vercel
│   ├── vercel.json       # Vercel configuration
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   └── dist/             # Build output (generated)
└── mock-backend/         # Not deployed to Vercel (deploy separately)
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `https://api.example.com/api` |

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Root directory set to `frontend`
- [ ] Environment variables configured
- [ ] Build successful
- [ ] Application accessible
- [ ] API calls working
- [ ] Routing working (test by refreshing pages)
- [ ] Authentication flow working

## Next Steps After Deployment

1. **Deploy Backend** (if not already done)
   - Options: Railway, Render, Heroku, AWS, etc.
   - Update `VITE_API_BASE_URL` in Vercel with backend URL

2. **Set Up Custom Domain** (optional)
   - Add domain in Vercel settings
   - Configure DNS

3. **Monitor Deployments**
   - Check Vercel dashboard regularly
   - Set up deployment notifications

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify environment variables
4. Test API endpoints directly
5. Check CORS configuration on backend

## Quick Deploy Commands

```bash
# Test build locally first
cd frontend
npm run build

# If successful, deploy to Vercel
vercel --prod
```

---

**Your Repository**: https://github.com/ChandanaJagath/helthcare-appoinment-system.git  
**Vercel Dashboard**: https://vercel.com/jagaths-projects-f1951148
