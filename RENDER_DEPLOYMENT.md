# Render Deployment Guide for Future Viz

## Overview
This guide deploys the full-stack app on Render:
- **Backend**: Node.js/Express API
- **Frontend**: React/Vite (static site)
- **Database**: MongoDB Atlas (free tier)

---

## Prerequisites

1. **GitHub Account** - Repository must be on GitHub
2. **Render Account** - Sign up at https://render.com
3. **MongoDB Atlas Account** - Free tier at https://www.mongodb.com/cloud/atlas
4. **Git Installed** - For pushing code to GitHub

---

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account or sign in
3. Click "Build a Database" → Select Free (M0)
4. Choose region and create cluster
5. Wait for cluster to deploy (5-10 minutes)
6. Go to **Security** → **Database Access**
   - Create a database user (e.g., `future_user`)
   - Set a strong password
7. Go to **Security** → **Network Access**
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
8. Click **Connect** on cluster page
   - Choose "Drivers"
   - Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/future?retryWrites=true&w=majority`
9. Save this connection string - you'll need it for Render

---

## Step 2: Prepare GitHub Repository

Make sure your code is pushed to GitHub:

```bash
cd b:\future

# If not already a git repo
git init

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/future.git

# Push to GitHub
git branch -M main
git add .
git commit -m "Ready for Render deployment"
git push -u origin main
```

---

## Step 3: Deploy Backend on Render

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Select "Build and deploy from a Git repository"
4. Click "Connect account" and authorize GitHub
5. Search and select your `future` repository
6. Configure the service:
   - **Name**: `future-viz-backend`
   - **Environment**: `Node`
   - **Region**: Select closest to your users
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Branch**: `main`

7. Click "Create Web Service"
8. Wait for deployment (2-3 minutes)
9. Once deployed, copy your backend URL (e.g., `https://future-viz-backend.onrender.com`)

### Add Environment Variables to Backend

While service is deploying:

1. Go to the service settings
2. Click on "Environment"
3. Add these variables:

```
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/future?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_change_this_123456789
TWILIO_ACCOUNT_SID=your_twilio_sid_or_test_account
TWILIO_AUTH_TOKEN=your_twilio_auth_token_or_test_token
TWILIO_PHONE_NUMBER=+1234567890
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
```

4. Click "Save Changes"
5. Service will auto-redeploy with new variables

---

## Step 4: Deploy Frontend on Render

1. Go to https://render.com
2. Click "New +" → "Static Site"
3. Select your GitHub repository
4. Configure:
   - **Name**: `future-viz`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Branch**: `main`

5. Click "Create Static Site"
6. Wait for deployment (1-2 minutes)
7. Once deployed, copy your frontend URL

### Add Environment Variables to Frontend

1. In the Static Site settings, click "Environment"
2. Add:

```
VITE_API_URL=https://future-viz-backend.onrender.com/api
```

(Replace with your actual backend URL from Step 3)

3. Click "Save Changes"
4. Trigger a redeploy:
   - Go to "Deploys" tab
   - Click "Deploy latest commit"

---

## Step 5: Verify Deployment

### Test Backend
```
https://future-viz-backend.onrender.com/api/health
```

Should return a success response.

### Test Frontend
Visit your frontend URL from Render. The app should load and connect to the backend.

### Test OTP Functionality
1. Click "Send OTP" on login page
2. Enter phone number: `+1234567890`
3. You should see the OTP in backend logs

---

## Important Notes

### Render Free Tier
- Services sleep after 15 minutes of inactivity
- First request after sleep takes longer (cold start)
- Suitable for development/testing

### Production Improvements
1. Use a paid Render plan to prevent sleeping
2. Set up MongoDB Atlas backup
3. Enable HTTPS (auto-enabled on Render)
4. Add monitoring/logging
5. Use proper error tracking (e.g., Sentry)

### MongoDB Atlas Notes
- Free tier: 512 MB storage
- Sufficient for testing/development
- Upgrade to paid for production

---

## Useful Render Links

- Dashboard: https://dashboard.render.com
- Services: https://dashboard.render.com/services
- Logs: Check service page → "Logs" tab
- Environment Variables: Service settings → "Environment"

---

## Troubleshooting

### Backend not connecting to MongoDB
- Verify MongoDB URI in environment variables
- Check IP whitelist in MongoDB Atlas (should be 0.0.0.0/0)
- Check credentials are correct

### Frontend not connecting to backend
- Verify `VITE_API_URL` environment variable
- Check if it includes `/api` at the end
- Verify backend service is running

### Render service keeps sleeping
- Use paid plan
- Add uptime monitoring ping

### Build fails
- Check build logs in Render dashboard
- Ensure Node version is compatible
- Verify all dependencies are in package.json

---

## Next Steps

1. Monitor logs: https://dashboard.render.com/services
2. Set up custom domain (optional): Service settings → "Custom Domain"
3. Enable auto-deploy on GitHub push (auto-enabled by default)
4. Add monitoring/alerts for production use
