# Fix 404 Error on Vercel

## Problem
Getting `404: NOT_FOUND` error when accessing `https://helthcare-appoinment-system.vercel.app`

## Solution

The 404 error is usually caused by incorrect Vercel project configuration. Follow these steps:

### Option 1: Fix in Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/jagaths-projects-f1951148
   - Select your project: `helthcare-appoinment-system`

2. **Go to Settings → General**
   - Scroll down to "Root Directory"
   - **Set Root Directory**: `frontend` ⚠️ **CRITICAL**
   - Click "Save"

3. **Verify Build Settings**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Redeploy**
   - Go to "Deployments" tab
   - Click the three dots (⋯) on latest deployment
   - Click "Redeploy"

### Option 2: Delete and Re-import Project

If Option 1 doesn't work:

1. **Delete the project in Vercel**
   - Go to Settings → General
   - Scroll to bottom
   - Click "Delete Project"

2. **Re-import with correct settings**
   - Click "Add New..." → "Project"
   - Import: `ChandanaJagath/helthcare-appoinment-system`
   - **IMPORTANT**: Set Root Directory to `frontend` during import
   - Configure:
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Deploy

### Option 3: Use Root vercel.json (Alternative)

If you want to deploy from root (not recommended, but works):

1. The root `vercel.json` is already created
2. In Vercel Dashboard:
   - Set Root Directory to `.` (root)
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`

## Common Causes of 404

| Issue | Solution |
|-------|----------|
| Root Directory not set | Set to `frontend` in Vercel settings |
| Output Directory wrong | Should be `dist` |
| Build failing | Check build logs in Vercel |
| vercel.json in wrong location | Should be in `frontend/` if root is `frontend` |
| Framework not detected | Manually set to "Vite" |

## Verify Build is Working

1. **Check Build Logs**
   - Go to Deployments tab
   - Click on latest deployment
   - Check "Build Logs"
   - Should see: `✓ built in X.XXs`

2. **Check Build Output**
   - In build logs, verify:
     - `dist/index.html` exists
     - Assets are generated
     - No build errors

## Quick Fix Checklist

- [ ] Root Directory = `frontend` in Vercel settings
- [ ] Build Command = `npm run build`
- [ ] Output Directory = `dist`
- [ ] Framework = Vite
- [ ] `vercel.json` exists in `frontend/` folder
- [ ] Build succeeds (check logs)
- [ ] Redeploy after changing settings

## Test After Fix

1. Visit: `https://helthcare-appoinment-system.vercel.app`
2. Should see login page (not 404)
3. Check browser console for errors
4. Test routing (navigate to different pages)

## Still Getting 404?

1. **Check Vercel Build Logs**
   - Look for errors
   - Verify build completed successfully

2. **Verify File Structure**
   ```
   frontend/
   ├── vercel.json  ✅
   ├── package.json ✅
   ├── vite.config.js ✅
   └── dist/         ✅ (after build)
       └── index.html ✅
   ```

3. **Contact Support**
   - Share build logs
   - Share project settings screenshot

---

**Most Common Fix**: Set Root Directory to `frontend` in Vercel Dashboard Settings!
