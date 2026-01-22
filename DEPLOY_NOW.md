# 🚀 DEPLOY BACKEND NOW - Quick Steps

## ⚠️ Current Issue
Frontend on Vercel can't connect to backend because backend is not deployed.

## ✅ Solution: Deploy Backend to Railway (5 minutes)

### Step 1: Deploy to Railway

1. **Go to**: https://railway.app
2. **Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose**: `ChandanaJagath/helthcare-appoinment-system`
6. **Wait** for Railway to detect your repo

### Step 2: Configure Service

1. **Click on the service** Railway created
2. **Go to "Settings" tab**
3. **Set Root Directory**: `mock-backend`
4. **Click "Save"**
5. **Go to "Deploy" tab**
6. **Verify Start Command**: `node server.js` (should be auto-detected)

### Step 3: Get Backend URL

1. **Go to "Settings" → "Domains"**
2. **Click "Generate Domain"**
3. **Copy the URL** (e.g., `https://helthcare-backend-production.up.railway.app`)
4. **Test it**: Visit `https://your-url.railway.app/api/health`
   - Should show: `{"status":"ok"}`

### Step 4: Add to Vercel

1. **Go to**: https://vercel.com/jagaths-projects-f1951148/helthcare-appoinment-system/settings/environment-variables
2. **Click "Add New"**
3. **Enter**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-railway-url.railway.app/api`
     - Replace with your actual Railway URL
     - **MUST include `/api` at the end**
   - **Environment**: Check all (Production, Preview, Development)
4. **Click "Save"**

### Step 5: Redeploy Frontend

1. **Go to Vercel "Deployments" tab**
2. **Click "Redeploy"** on latest deployment
3. **Wait 1-2 minutes**
4. **Test login** - should work!

## ✅ Code Status

- ✅ Backend code ready (uses `process.env.PORT`)
- ✅ Frontend configured to use `VITE_API_BASE_URL`
- ✅ All files pushed to GitHub
- ✅ Ready for deployment

## Quick Checklist

- [ ] Backend deployed on Railway
- [ ] Root Directory = `mock-backend` in Railway
- [ ] Backend URL obtained and tested
- [ ] `VITE_API_BASE_URL` added in Vercel
- [ ] Frontend redeployed on Vercel
- [ ] Login tested and working

---

**Once backend is deployed and environment variable is set, everything will work!**
