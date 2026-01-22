# 🚨 FIX BUILD ERROR - Exit Code 126

## The Problem
**Error**: `Command "npm install && npm run build" exited with 126`

This error means Vercel can't find your `package.json` because it's looking in the wrong directory!

## ✅ IMMEDIATE FIX (Do This Now)

### Step 1: Go to Settings
1. On your Vercel page: https://vercel.com/jagaths-projects-f1951148/helthcare-appoinment-system
2. Click **"Settings"** tab (top navigation)
3. Click **"General"** in left sidebar

### Step 2: Fix Root Directory ⚠️ CRITICAL
1. Scroll down to **"Root Directory"** section
2. You'll see **"3 Recommendations"** - this is telling you to fix it!
3. Click **"Edit"** button
4. Enter: `frontend` (exactly this, no quotes, no slash)
5. Click **"Save"**

### Step 3: Verify Build Settings
After setting Root Directory, these should auto-update:
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build` (NOT `npm install && npm run build`)
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**Important**: If Build Command shows `npm install && npm run build`, change it to just `npm run build` (Vercel runs install automatically)

### Step 4: Redeploy
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** button (top right)
3. Or click three dots (⋯) on latest deployment → "Redeploy"
4. Wait for build to complete (~1-2 minutes)

### Step 5: Check Build Logs
1. Click on the new deployment
2. Click **"Build Logs"** tab
3. Should see:
   - ✅ `npm install` running
   - ✅ `vite build` running
   - ✅ `✓ built in X.XXs`
   - ❌ If errors, share them

## Why Exit Code 126 Happens

Exit code 126 means "command cannot be executed". This happens because:

1. **Root Directory is wrong** → Vercel looks in root (`helthcare/`) instead of `frontend/`
2. **No package.json found** → Can't run `npm install`
3. **Command fails** → Exit code 126

Your structure:
```
helthcare/                    ← Vercel is looking HERE (WRONG)
├── frontend/                 ← Your code is HERE (CORRECT)
│   ├── package.json         ← Vercel needs to find THIS
│   ├── src/
│   └── dist/
└── mock-backend/
```

## Alternative: Fix Build Command

If Root Directory is already set to `frontend` but still failing:

1. Go to **Settings** → **General**
2. Find **"Build Command"**
3. Change from: `npm install && npm run build`
4. Change to: `npm run build`
5. Vercel automatically runs `npm install` first, so you don't need it in the command

## Quick Checklist

- [ ] Root Directory = `frontend` ✅
- [ ] Build Command = `npm run build` (not `npm install && npm run build`) ✅
- [ ] Output Directory = `dist` ✅
- [ ] Install Command = `npm install` ✅
- [ ] Redeployed after changes ✅
- [ ] Build succeeds (check logs) ✅

## Still Failing?

### Check Build Logs
1. Click on deployment
2. Click **"Build Logs"** tab
3. Look for specific error messages
4. Common errors:
   - `Cannot find module` → Dependencies issue
   - `Command not found` → Root Directory wrong
   - `Permission denied` → Build command issue

### Delete and Re-import (Last Resort)

1. **Delete Project**
   - Settings → General → Scroll to bottom
   - Click "Delete Project"

2. **Re-import with Correct Settings**
   - Click "Add New..." → "Project"
   - Import: `ChandanaJagath/helthcare-appoinment-system`
   - **During import:**
     - Set Root Directory: `frontend`
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Click "Deploy"

---

**The fix: Set Root Directory to `frontend` and Build Command to `npm run build`!**
