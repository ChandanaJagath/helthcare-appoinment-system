# 🚀 Quick Backend Deployment Guide

## The Problem
Your frontend on Vercel can't connect to the backend because it's only running locally. You need to deploy the backend.

## ✅ Solution: Deploy Backend to Railway (5 minutes)

### Step 1: Deploy Backend to Railway

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Select your repository**: `ChandanaJagath/helthcare-appoinment-system`
6. **Railway will start deploying** - wait a moment

### Step 2: Configure Railway Settings

After Railway detects your repo:

1. **Click on the service** that was created
2. **Go to "Settings" tab**
3. **Set Root Directory**:
   - Find "Root Directory" field
   - Enter: `mock-backend`
   - Click "Save"
4. **Go to "Variables" tab** (optional - for PORT)
   - Railway will auto-assign a PORT, but your server uses 8000
   - Add variable: `PORT` = `8000` (if needed)
5. **Go to "Deploy" tab**
   - Railway should auto-detect: `node server.js`
   - If not, set Start Command: `node server.js`

### Step 3: Get Your Backend URL

1. **Go to "Settings" tab**
2. **Scroll to "Domains" section**
3. **Click "Generate Domain"** (or use the auto-generated one)
4. **Copy the URL** (e.g., `https://helthcare-backend.railway.app`)
5. **Test it**: Visit `https://your-url.railway.app/api/health` in browser
   - Should show: `{"status":"ok"}`

### Step 4: Update Backend for Railway (if needed)

Railway might use a different PORT. Update `server.js` to use Railway's PORT:

```javascript
const PORT = process.env.PORT || 8000;
```

But first, check if Railway deployment works with current code.

### Step 5: Add Environment Variable in Vercel

1. **Go to Vercel**: https://vercel.com/jagaths-projects-f1951148/helthcare-appoinment-system/settings/environment-variables
2. **Click "Add New"**
3. **Fill in**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-railway-url.railway.app/api`
     - Replace `your-railway-url` with your actual Railway URL
   - **Environment**: Check all (Production, Preview, Development)
4. **Click "Save"**

### Step 6: Redeploy Frontend

1. **Go to Vercel Deployments tab**
2. **Click "Redeploy"** on latest deployment
3. **Wait for build** (1-2 minutes)
4. **Test login** - should work now!

## Alternative: Render.com (If Railway doesn't work)

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **Click "New +"** → **"Web Service"**
4. **Connect GitHub repo**: `ChandanaJagath/helthcare-appoinment-system`
5. **Configure**:
   - **Name**: `helthcare-backend`
   - **Root Directory**: `mock-backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. **Click "Create Web Service"**
7. **Wait for deployment** (3-5 minutes)
8. **Copy the URL** (e.g., `https://helthcare-backend.onrender.com`)
9. **Add to Vercel**: `https://helthcare-backend.onrender.com/api`

## Quick Checklist

- [ ] Backend deployed to Railway/Render
- [ ] Backend URL obtained (e.g., `https://xxx.railway.app`)
- [ ] Tested backend URL in browser (`/api/health` works)
- [ ] Added `VITE_API_BASE_URL` in Vercel environment variables
- [ ] Value is: `https://your-backend-url.com/api` (with `/api` at end)
- [ ] Redeployed frontend on Vercel
- [ ] Tested login - should work!

## Troubleshooting

**Backend not working?**
- Check Railway/Render logs for errors
- Verify `node server.js` is the start command
- Check Root Directory is set to `mock-backend`

**Login still fails?**
- Verify environment variable name: `VITE_API_BASE_URL` (exact)
- Verify URL ends with `/api`
- Check Vercel deployment logs
- Make sure you redeployed after adding environment variable

---

**Once backend is deployed and environment variable is set, login will work!**
