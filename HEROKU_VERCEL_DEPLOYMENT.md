# Heroku + Vercel Deployment Script for Future Viz

This script will deploy:
- **Backend** to Heroku
- **Frontend** to Vercel

## Prerequisites

- Heroku CLI installed ✓
- Vercel CLI installed ✓
- GitHub repository configured ✓
- Heroku account: https://www.heroku.com
- Vercel account: https://vercel.com

## Deployment Steps

### STEP 1: Deploy Backend to Heroku

```bash
cd backend

# Login to Heroku
heroku login

# Create a new Heroku app
heroku create future-viz-backend

# Add MongoDB Atlas database
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create a free cluster
# 3. Get your connection string: mongodb+srv://user:password@cluster.mongodb.net/dbname

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key-here
heroku config:set MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/future
heroku config:set TWILIO_ACCOUNT_SID=your_twilio_sid
heroku config:set TWILIO_AUTH_TOKEN=your_twilio_token
heroku config:set TWILIO_PHONE_NUMBER=+1234567890

# Deploy to Heroku
git push heroku main

# Check logs
heroku logs --tail
```

### STEP 2: Deploy Frontend to Vercel

```bash
cd frontend

# Deploy to Vercel
vercel --prod

# Note: When prompted, configure as follows:
# - Set project name: future-viz
# - Framework: Vite
# - Build command: npm run build
# - Output directory: dist
```

### STEP 3: Configure Environment Variables in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your `future-viz` project
3. Click **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** VITE_API_URL
   - **Value:** https://future-viz-backend.herokuapp.com/api
5. Click **Save**
6. Redeploy with new environment variables:
   ```bash
   vercel --prod
   ```

### STEP 4: Test Your Deployment

1. Visit your Vercel frontend URL (from deployment)
2. Check browser console for API errors
3. Test API health check:
   ```
   https://future-viz-backend.herokuapp.com/api/health
   ```

## Useful Commands

```bash
# Heroku
heroku logs --tail              # View backend logs
heroku config                    # View all environment variables
heroku apps                      # List your apps
heroku config:unset VAR_NAME    # Remove environment variable

# Vercel
vercel env list                  # List environment variables
vercel env add VITE_API_URL      # Add environment variable
vercel logs                       # View deployment logs
```

## Troubleshooting

**Frontend shows 502/503 errors?**
- Check backend is running: `heroku logs --tail`
- Verify `VITE_API_URL` is set correctly in Vercel
- Check CORS is enabled in backend

**Backend won't deploy?**
- Check all required environment variables are set
- View logs: `heroku logs --tail`
- Ensure Node.js version is compatible

**Can't push to Heroku?**
- Run: `git remote -v` to check Heroku remote is added
- If missing, run: `heroku git:remote -a future-viz-backend`

## Success Indicators

✓ Backend deployed to: `https://future-viz-backend.herokuapp.com`
✓ Frontend deployed to: `https://<your-project>.vercel.app`
✓ `/api/health` endpoint returns: `{"message":"Server is running"}`
✓ Frontend loads without errors
✓ Frontend can communicate with backend
