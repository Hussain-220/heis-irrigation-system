# HEIS Deployment Guide - Complete Setup

## Frontend Deployment ✅ DONE
- **Status**: Live on Vercel
- **URL**: https://heis-irrigation-system.vercel.app/
- **Dashboard**: https://vercel.com/confuseddevelopers/heis-irrigation-system

---

## Backend Deployment - RENDER

### Step 1: Prepare Backend on GitHub
Your backend code is already in the `/backend` directory with:
- `server.js` - Express server with CORS_ORIGIN environment variable configured
- `controllers/` - Calculation and PDF generation engines
- `package.json` - Dependencies (express, cors, pdf-lib, axios, dotenv)

✅ Already pushed to GitHub

---

### Step 2: Deploy to Render

#### 2.1 Go to Render Dashboard
1. Visit https://dashboard.render.com
2. Sign in with your GitHub account
3. Click **New** → **Web Service**

#### 2.2 Connect GitHub Repository
1. Search for `heis-irrigation-system` repository
2. Click **Connect**
3. Grant Render permission to access your repo

#### 2.3 Configure Web Service Settings
Fill in the following fields:

| Field | Value |
|-------|-------|
| **Name** | `heis-irrigation-backend` |
| **Environment** | `Node` |
| **Region** | `Ohio` (or closest to users) |
| **Branch** | `main` |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && npm start` |
| **Instance Type** | `Free` (sufficient for testing) |

#### 2.4 Add Environment Variable
1. Scroll down to **Environment** section
2. Click **Add Environment Variable**
3. Add:
   - **Name**: `CORS_ORIGIN`
   - **Value**: `https://heis-irrigation-system.vercel.app`

4. Click **Create Web Service**
5. Wait 3-5 minutes for deployment (watch the logs)

#### 2.5 Get Backend URL
Once deployment is complete:
1. Look for the service URL in the top-left corner
2. It will be something like: `https://heis-irrigation-backend.onrender.com`
3. **Copy this URL** - you'll need it for the next step

---

### Step 3: Update Vercel Frontend with Backend URL

#### 3.1 Go to Vercel Project Settings
1. Visit https://vercel.com/confuseddevelopers/heis-irrigation-system
2. Click **Settings**
3. Select **Environment Variables** (left sidebar)

#### 3.2 Add Backend API URL
1. Click **Add New**
2. Fill in:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://heis-irrigation-backend.onrender.com` (from Render)
   - **Environments**: Select all (Production, Preview, Development)
3. Click **Save**

#### 3.3 Redeploy Frontend
1. Go to **Deployments** tab
2. Find the latest deployment (top one)
3. Click the **...** menu → **Redeploy**
4. Wait 1-2 minutes for redeployment
5. ✅ Frontend will now use the backend API

---

### Step 4: Test Live Application

#### 4.1 Open Live App
- Visit: https://heis-irrigation-system.vercel.app/

#### 4.2 Test Drip System
1. Click **Drip Irrigation 💧**
2. Fill in default values and click **Calculate**
3. Verify:
   - ✅ Calculations appear (System Flow, Pump Power, etc.)
   - ✅ BOQ table shows 25 items
   - ✅ Total cost displays in PKR

#### 4.3 Test Sprinkler System
1. Click **Sprinkler Irrigation 💦**
2. Fill in values and click **Calculate**
3. Verify:
   - ✅ Calculations appear
   - ✅ BOQ table shows 12 items
   - ✅ About modal works (click About button in navbar)

#### 4.4 Test PDF Download
1. Click **Download PDF Report** button
2. ✅ PDF downloads to your computer
3. Open and verify:
   - System type and parameters included
   - All BOQ items listed
   - Total cost shown

#### 4.5 Test About Modal
1. Click **About** in navbar
2. ✅ Modal shows project description
3. ✅ Team members displayed (no roles)
4. ✅ Institution info visible
5. ✅ Close button works

---

## Deployment Summary

| Component | Status | URL |
|-----------|--------|-----|
| **Frontend** | ✅ Live | https://heis-irrigation-system.vercel.app |
| **Backend** | 🔄 Deploy now | https://heis-irrigation-backend.onrender.com |
| **GitHub** | ✅ Ready | https://github.com/confuseddevelopers/heis-irrigation-system |

---

## Troubleshooting

### Backend Deployment Fails
1. Check Render logs for errors
2. Verify `backend/package.json` exists
3. Ensure `backend/server.js` has correct PORT binding
4. Try redeploying: Dashboard → Service → Redeploy

### PDF Download Returns Error
1. Check browser console for CORS errors
2. Verify `CORS_ORIGIN` in Render environment variables
3. Redeploy Render backend after fixing

### Calculations Not Working After Deployment
1. Check Network tab in browser DevTools
2. Verify API calls go to correct backend URL
3. Redeploy Vercel frontend with correct `REACT_APP_API_URL`

### Changes Not Reflecting
1. Push changes to GitHub
2. Render redeploys automatically (or click Redeploy)
3. Vercel redeploys automatically (or click Redeploy)
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

---

## Production Notes

- **Render Free Tier**: Spins down after 15 minutes of inactivity (first request takes ~30s)
- **Vercel**: Always active, no spin-down
- **Both services**: Auto-redeploy on GitHub push to main branch
- **Recommended**: Later upgrade to paid plans for production reliability

---

**Ready to deploy! Start with Step 2.1 above.** 🚀
