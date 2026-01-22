# 🔧 How to Add Environment Variable in Vercel

## Step-by-Step Instructions

### Step 1: Access Environment Variables Page

1. Go to: https://vercel.com/jagaths-projects-f1951148/helthcare-appoinment-system/settings/environment-variables
2. You should see a form to add environment variables

### Step 2: Fill in the Form

**Field 1: Key (Name)**
```
VITE_API_BASE_URL
```
- This is the exact name your frontend code looks for
- Must be exactly: `VITE_API_BASE_URL` (case-sensitive)

**Field 2: Value**
```
https://your-backend-url.com/api
```
- Replace `your-backend-url.com` with your actual deployed backend URL
- Examples:
  - Railway: `https://your-app.railway.app/api`
  - Render: `https://your-app.onrender.com/api`
  - Heroku: `https://your-app.herokuapp.com/api`
- **Important**: Include `/api` at the end

**Field 3: Environment**
- Select all three:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- This ensures it works in all environments

### Step 3: Save

1. Click **"Save"** or **"Add"** button
2. The environment variable will be added to your project

### Step 4: Redeploy

After adding the environment variable:
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment
3. Or push a new commit to trigger auto-deploy

## ⚠️ Important: You Need a Backend URL First!

**Before adding the environment variable, you MUST deploy your backend!**

The backend is in the `mock-backend` folder. You need to deploy it to:
- Railway (https://railway.app) - Recommended
- Render (https://render.com)
- Heroku (https://heroku.com)

### Quick Backend Deployment (Railway - Easiest)

1. **Go to Railway**: https://railway.app
2. **Sign up** with GitHub
3. **Create New Project** → **Deploy from GitHub repo**
4. **Select your repo**: `ChandanaJagath/helthcare-appoinment-system`
5. **Configure**:
   - Root Directory: `mock-backend`
   - Build Command: (auto-detected)
   - Start Command: `node server.js`
6. **Wait for deployment** (2-3 minutes)
7. **Copy the URL** (e.g., `https://your-app.railway.app`)
8. **Use this URL** in Vercel environment variable: `https://your-app.railway.app/api`

## Example Form Fill

```
Key:   VITE_API_BASE_URL
Value: https://helthcare-backend.railway.app/api
Environment: [✓] Production [✓] Preview [✓] Development
```

## After Setup

1. ✅ Environment variable added
2. ✅ Frontend redeployed
3. ✅ Backend deployed and running
4. ✅ Login should work!

## Troubleshooting

**If login still fails:**
- Check backend is running (visit backend URL in browser)
- Verify environment variable name is exactly `VITE_API_BASE_URL`
- Make sure URL ends with `/api`
- Check Vercel deployment logs for errors
- Redeploy frontend after adding environment variable

---

**Remember**: Deploy backend FIRST, then add the environment variable with the backend URL!
