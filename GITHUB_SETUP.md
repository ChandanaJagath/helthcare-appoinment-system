# GitHub Setup Guide

## Step 1: Initialize Git Repository

If you haven't already initialized git:

```bash
cd c:\Users\Administrator\Desktop\projects\helthcare
git init
```

## Step 2: Add All Files

```bash
git add .
```

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Healthcare Appointment System with Vercel deployment configuration"
```

## Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Repository name: `healthcare-appointment-system` (or your preferred name)
3. Description: "Modern healthcare appointment management system"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 5: Connect and Push

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/healthcare-appointment-system.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 6: Verify

Visit your repository on GitHub to confirm all files are uploaded.

## Next Steps

After pushing to GitHub:
1. Follow [DEPLOYMENT.md](./DEPLOYMENT.md) to deploy to Vercel
2. Set up environment variables in Vercel dashboard
3. Configure your backend API URL

## Repository Structure

Your repository should have:
- ✅ `.gitignore` - Properly configured
- ✅ `frontend/` - Vue.js application
- ✅ `mock-backend/` - Node.js API server
- ✅ `DEPLOYMENT.md` - Deployment instructions
- ✅ `README.md` - Project documentation
- ✅ `.github/workflows/` - CI/CD workflows (optional)

## Important Notes

- Never commit `.env` files (they're in `.gitignore`)
- Never commit `node_modules/` (they're in `.gitignore`)
- The `dist/` folder is generated and shouldn't be committed
- Update `VITE_API_BASE_URL` in Vercel environment variables after deployment
