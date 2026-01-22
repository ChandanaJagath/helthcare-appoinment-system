# Vercel Deployment Setup

## ⚠️ CRITICAL: Set Root Directory

The most important step to fix 404 and build errors:

1. Go to: https://vercel.com/jagaths-projects-f1951148/helthcare-appoinment-system
2. Click **"Settings"** tab
3. Click **"General"** in left sidebar
4. Scroll to **"Root Directory"**
5. Click **"Edit"**
6. Enter: `frontend`
7. Click **"Save"**

## Build Settings (Auto-updates after Root Directory)

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Environment Variables (Optional)

If you have a backend API deployed:
- **Name**: `VITE_API_BASE_URL`
- **Value**: `https://your-backend-api.com/api`

## Redeploy

After setting Root Directory:
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** button
3. Wait for build to complete

## Verify

Visit: `https://helthcare-appoinment-system.vercel.app`
- Should show login page (not 404)
- All routes should work

---

**That's it! Set Root Directory to `frontend` and redeploy.**
