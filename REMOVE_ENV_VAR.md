# ⚠️ IMPORTANT: Remove Environment Variable in Vercel

## The Problem

The console shows the frontend is trying to call:
```
https://your-backend-url.com/api/auth/login
```

This means there's an environment variable `VITE_API_BASE_URL` set in Vercel with a placeholder value.

## ✅ Solution: Remove the Environment Variable

The backend is now a Vercel serverless function, so you **don't need** the `VITE_API_BASE_URL` environment variable anymore.

### Steps to Remove:

1. **Go to Vercel Dashboard**
   - https://vercel.com/jagaths-projects-f1951148/helthcare-appoinment-system/settings/environment-variables

2. **Find `VITE_API_BASE_URL`**
   - Look for the environment variable named `VITE_API_BASE_URL`

3. **Delete it**
   - Click the delete/trash icon next to it
   - Confirm deletion

4. **Redeploy**
   - Go to "Deployments" tab
   - Click "Redeploy" on latest deployment
   - Wait for build (1-2 minutes)

5. **Test**
   - Login should work now!

## Why This Is Needed

- ✅ Backend is now a Vercel serverless function at `frontend/api/index.js`
- ✅ Frontend uses relative path `/api` (same domain)
- ✅ No external backend URL needed
- ❌ Environment variable `VITE_API_BASE_URL` is overriding the relative path
- ❌ The placeholder value `your-backend-url.com` is causing the error

## After Removing Environment Variable

- Frontend will use `/api` (relative path)
- Vercel will route `/api/*` to the serverless function
- Everything works on the same domain!

---

**Remove `VITE_API_BASE_URL` from Vercel environment variables, then redeploy!**
