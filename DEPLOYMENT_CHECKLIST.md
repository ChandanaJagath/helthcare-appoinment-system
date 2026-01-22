# Vercel Deployment Checklist

Use this checklist to ensure a successful deployment to Vercel.

## Pre-Deployment Checklist

### ✅ Code Preparation
- [x] All code committed to GitHub
- [x] Build tested locally (`npm run build` succeeds)
- [x] No build errors or warnings
- [x] `vercel.json` configured correctly
- [x] `.gitignore` excludes `node_modules` and `dist`

### ✅ Configuration Files
- [x] `frontend/vercel.json` exists with SPA routing rewrites
- [x] `frontend/package.json` has correct build script
- [x] `frontend/vite.config.js` configured for production
- [x] Environment variables documented

### ✅ Project Structure
- [x] Frontend code in `frontend/` directory
- [x] Backend code in `mock-backend/` directory (separate deployment)
- [x] All dependencies in `package.json`

## Vercel Deployment Steps

### Step 1: Import Project
- [ ] Go to https://vercel.com/jagaths-projects-f1951148
- [ ] Click "Add New..." → "Project"
- [ ] Import: `ChandanaJagath/helthcare-appoinment-system`

### Step 2: Configure Project
- [ ] **Framework Preset**: Vite (auto-detected)
- [ ] **Root Directory**: `frontend` ⚠️ CRITICAL
- [ ] **Build Command**: `npm run build` (auto-filled)
- [ ] **Output Directory**: `dist` (auto-filled)
- [ ] **Install Command**: `npm install` (auto-filled)

### Step 3: Environment Variables
- [ ] Add `VITE_API_BASE_URL` environment variable
- [ ] Set value to your backend API URL
- [ ] Apply to: Production, Preview, Development

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Check build logs for errors

### Step 5: Verify Deployment
- [ ] Visit deployment URL
- [ ] Test login page loads
- [ ] Check browser console for errors
- [ ] Test API connectivity
- [ ] Test routing (refresh pages)

## Post-Deployment Checklist

### ✅ Functionality Tests
- [ ] Login page displays correctly
- [ ] Registration works
- [ ] API calls succeed (check network tab)
- [ ] Routing works (no 404 on refresh)
- [ ] Authentication flow works
- [ ] Dashboard loads for each role

### ✅ Error Checks
- [ ] No console errors in browser
- [ ] No CORS errors
- [ ] No 404 errors for routes
- [ ] No build errors in Vercel logs

### ✅ Backend Integration
- [ ] Backend API is deployed and accessible
- [ ] CORS configured on backend for Vercel domain
- [ ] `VITE_API_BASE_URL` points to correct backend
- [ ] API endpoints respond correctly

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Build fails | Check build logs, verify all dependencies |
| 404 on routes | Verify `vercel.json` rewrites configuration |
| API calls fail | Check `VITE_API_BASE_URL` and CORS |
| CORS errors | Update backend CORS to include Vercel domain |
| Environment variable not working | Redeploy after adding/changing variables |

## Quick Deploy Commands

```bash
# Test build locally
cd frontend
npm run build

# If successful, push to GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push origin main

# Vercel will auto-deploy if connected to GitHub
```

## Important URLs

- **GitHub Repo**: https://github.com/ChandanaJagath/helthcare-appoinment-system.git
- **Vercel Dashboard**: https://vercel.com/jagaths-projects-f1951148
- **Deployment URL**: Will be provided after deployment (e.g., `https://helthcare-appoinment-system.vercel.app`)

## Next Steps After Deployment

1. **Deploy Backend** (if not already done)
   - Deploy `mock-backend` to Railway, Render, or similar
   - Update `VITE_API_BASE_URL` in Vercel

2. **Test Full System**
   - Test all user flows
   - Test all roles (Admin, Doctor, Patient)
   - Test appointment booking

3. **Set Up Monitoring**
   - Monitor Vercel deployments
   - Set up error tracking (optional)

4. **Custom Domain** (optional)
   - Add custom domain in Vercel
   - Configure DNS

---

**Ready to Deploy!** Follow the steps above and refer to `VERCEL_DEPLOYMENT.md` for detailed instructions.
