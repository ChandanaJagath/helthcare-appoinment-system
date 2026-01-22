# Fix 404 Error on Vercel - Step by Step

## The Problem
You're seeing `404: NOT_FOUND` at `https://helthcare-appoinment-system.vercel.app`

## The Solution

The 404 error happens because Vercel can't find your built files. This is almost always due to **incorrect Root Directory** setting.

### ✅ Fix Steps (Do This Now)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/jagaths-projects-f1951148
   - Click on your project: `helthcare-appoinment-system`

2. **Go to Settings**
   - Click "Settings" tab
   - Click "General" in the left sidebar

3. **Set Root Directory** ⚠️ **CRITICAL STEP**
   - Scroll down to "Root Directory" section
   - Click "Edit"
   - Enter: `frontend`
   - Click "Save"

4. **Verify Build Settings** (should auto-update)
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Redeploy**
   - Go to "Deployments" tab
   - Find the latest deployment
   - Click the three dots (⋯) menu
   - Click "Redeploy"
   - Wait for build to complete (~1-2 minutes)

6. **Test**
   - Visit: `https://helthcare-appoinment-system.vercel.app`
   - Should now show login page instead of 404!

## Why This Happens

Vercel needs to know where your frontend code is. If Root Directory is not set to `frontend`, Vercel looks in the wrong place and can't find your `dist` folder.

## Alternative: If Root Directory Fix Doesn't Work

### Option A: Delete and Re-import Project

1. **Delete Project in Vercel**
   - Settings → General → Scroll to bottom
   - Click "Delete Project"

2. **Re-import with Correct Settings**
   - Click "Add New..." → "Project"
   - Import: `ChandanaJagath/helthcare-appoinment-system`
   - **During import, set Root Directory to `frontend`**
   - Verify settings:
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Click "Deploy"

### Option B: Check Build Logs

1. Go to "Deployments" tab
2. Click on latest deployment
3. Click "Build Logs"
4. Look for errors:
   - If build failed → fix the error
   - If build succeeded but 404 → Root Directory is wrong

## Verification Checklist

After fixing, verify:

- [ ] Root Directory = `frontend` in Vercel settings
- [ ] Build Command = `npm run build`
- [ ] Output Directory = `dist`
- [ ] Build succeeds (check logs)
- [ ] `dist/index.html` exists after build
- [ ] Application loads (not 404)
- [ ] Login page displays

## Common Issues

| Issue | Fix |
|-------|-----|
| Still 404 after setting root | Redeploy after changing settings |
| Build fails | Check build logs, verify dependencies |
| Wrong framework detected | Manually set to "Vite" |
| Can't find dist folder | Verify Output Directory = `dist` |

## Quick Test

After redeploying, test these URLs:
- `https://helthcare-appoinment-system.vercel.app` → Should show login
- `https://helthcare-appoinment-system.vercel.app/login` → Should show login
- `https://helthcare-appoinment-system.vercel.app/register` → Should show register

All should work, not 404!

---

**Most Important**: Set Root Directory to `frontend` in Vercel Settings → General!
