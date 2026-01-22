# 🚂 Railway Backend Deployment - Step by Step

## Current Status
You're on Railway and need to configure the service for your backend.

## Configuration Steps

### Step 1: Set Root Directory

1. **In Railway**, go to your service settings
2. **Click "Settings" tab**
3. **Find "Root Directory"** section
4. **Set it to**: `mock-backend`
5. **Click "Save"**

This tells Railway to look in the `mock-backend` folder for your `package.json` and `server.js`.

### Step 2: Verify Start Command

1. **Go to "Deploy" tab** (or "Settings" → "Deploy")
2. **Check "Start Command"**:
   - Should be: `node server.js`
   - If not set, add it manually

### Step 3: Wait for Deployment

1. Railway will automatically redeploy after you change settings
2. **Watch the "Deployments" tab** for build progress
3. Wait for status to show "Deployed" (usually 2-3 minutes)

### Step 4: Get Your Backend URL

1. **Go to "Settings" tab**
2. **Scroll to "Domains" section**
3. **Click "Generate Domain"** (if not already generated)
4. **Copy the URL** (e.g., `https://helthcare-backend-production.up.railway.app`)
5. **Test it**: Open in browser: `https://your-url.railway.app/api/health`
   - Should show: `{"status":"ok"}`

### Step 5: Add Environment Variable in Vercel

1. **Go to Vercel**: https://vercel.com/jagaths-projects-f1951148/helthcare-appoinment-system/settings/environment-variables
2. **Click "Add New"**
3. **Fill in**:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-railway-url.railway.app/api`
     - Replace `your-railway-url` with your actual Railway URL
     - **Important**: Include `/api` at the end
   - **Environment**: Check all three:
     - ☑ Production
     - ☑ Preview  
     - ☑ Development
4. **Click "Save"**

### Step 6: Redeploy Frontend on Vercel

1. **Go to Vercel Deployments tab**
2. **Click "Redeploy"** on the latest deployment
3. **Wait for build** (1-2 minutes)
4. **Test login** - should work now!

## Example Configuration

**Railway Settings:**
- Root Directory: `mock-backend`
- Start Command: `node server.js`
- Port: Auto-assigned by Railway (your code uses `process.env.PORT || 8000`)

**Vercel Environment Variable:**
- Key: `VITE_API_BASE_URL`
- Value: `https://helthcare-backend-production.up.railway.app/api`

## Troubleshooting

**Backend not deploying?**
- Check Railway logs in "Deployments" tab
- Verify Root Directory is exactly `mock-backend` (no trailing slash)
- Check that `package.json` exists in `mock-backend` folder
- Verify Start Command is `node server.js`

**Backend URL not working?**
- Make sure domain is generated in Railway Settings → Domains
- Test `/api/health` endpoint in browser
- Check Railway logs for errors

**Login still fails after setup?**
- Verify environment variable name: `VITE_API_BASE_URL` (exact, case-sensitive)
- Verify URL ends with `/api`
- Make sure you redeployed frontend after adding environment variable
- Check browser console for API errors

## Quick Checklist

- [ ] Root Directory set to `mock-backend` in Railway
- [ ] Start Command is `node server.js`
- [ ] Backend deployed successfully (status: Deployed)
- [ ] Domain generated and copied from Railway
- [ ] Tested backend URL: `/api/health` returns `{"status":"ok"}`
- [ ] Added `VITE_API_BASE_URL` in Vercel environment variables
- [ ] Value is: `https://your-railway-url.railway.app/api` (with `/api`)
- [ ] Redeployed frontend on Vercel
- [ ] Tested login - should work!

---

**Once all steps are complete, your login will work on Vercel!**
