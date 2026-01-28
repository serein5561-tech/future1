# 🚀 Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB connection verified
- [ ] Twilio account verified
- [ ] Frontend build tested locally
- [ ] Backend tests passing
- [ ] SSL certificates ready
- [ ] API rate limiting configured
- [ ] Error logging configured

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```

4. **Configure Environment Variables in Vercel Dashboard:**
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```

5. **Update `vite.config.js`:**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     server: {
       proxy: {
         '/api': process.env.VITE_API_URL || 'http://localhost:5000'
       }
     }
   })
   ```

### Option 2: Netlify

1. **Connect GitHub repository**

2. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Set environment variables:**
   ```
   VITE_API_URL=https://your-backend-domain.com/api
   ```

4. **Deploy:**
   ```bash
   npm run build
   # Deploy dist/ folder
   ```

### Option 3: Traditional Hosting

1. **Build the project:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload `dist/` folder to web server**

3. **Configure web server to serve SPA:**
   ```nginx
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

---

## Backend Deployment

### Option 1: Railway.app (Easiest)

1. **Push code to GitHub**

2. **Sign in to Railway.app**

3. **Connect GitHub repository**

4. **Add MongoDB plugin

5. **Set environment variables:**
   ```
   PORT=8000
   MONGODB_URI=<provided by Railway>
   JWT_SECRET=<generate strong key>
   TWILIO_ACCOUNT_SID=<your SID>
   TWILIO_AUTH_TOKEN=<your token>
   TWILIO_PHONE_NUMBER=<your number>
   OPENAI_API_KEY=<optional>
   REPLICATE_API_TOKEN=<optional>
   ```

6. **Deploy** - Railway automatically deploys on push

### Option 2: Heroku

1. **Install Heroku CLI:**
   ```bash
   brew install heroku/brew/heroku
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create app:**
   ```bash
   heroku create future-viz-backend
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set JWT_SECRET=your_secret
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set TWILIO_ACCOUNT_SID=your_sid
   heroku config:set TWILIO_AUTH_TOKEN=your_token
   heroku config:set TWILIO_PHONE_NUMBER=your_number
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

### Option 3: DigitalOcean / AWS / Google Cloud

1. **Create VM instance**

2. **Install dependencies:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install MongoDB:**
   ```bash
   sudo apt-get install -y mongodb
   ```

4. **Clone repository:**
   ```bash
   git clone your-repo-url
   cd future && cd backend
   ```

5. **Install and configure:**
   ```bash
   npm install
   cp .env.example .env
   # Edit .env with production values
   ```

6. **Setup PM2 (process manager):**
   ```bash
   sudo npm install -g pm2
   pm2 start src/index.js --name "future-viz-backend"
   pm2 startup
   pm2 save
   ```

7. **Setup Nginx reverse proxy:**
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;

     location / {
       proxy_pass http://localhost:5000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

8. **Setup SSL with Let's Encrypt:**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Database Deployment

### MongoDB Atlas (Cloud)

1. **Create account at atlas.mongodb.com**

2. **Create cluster:**
   - Choose free tier or paid plan
   - Select region close to users

3. **Create database user:**
   - Username: `future_viz_user`
   - Generate strong password

4. **Whitelist IP addresses:**
   - Add your backend server IP
   - Or allow all: `0.0.0.0/0` (less secure)

5. **Get connection string:**
   ```
   mongodb+srv://future_viz_user:password@cluster0.xxxxx.mongodb.net/future-viz
   ```

6. **Update backend `.env`:**
   ```
   MONGODB_URI=mongodb+srv://future_viz_user:password@cluster0.xxxxx.mongodb.net/future-viz
   ```

### Self-Hosted MongoDB

1. **Install on server:**
   ```bash
   sudo apt-get install mongodb
   ```

2. **Configure security:**
   - Create admin user
   - Enable authentication
   - Setup firewall rules

3. **Backup strategy:**
   ```bash
   # Daily backup
   0 2 * * * mongodump --out /backups/mongo_$(date +\%Y\%m\%d)
   ```

---

## Environment Variables (Production)

Create `.env` file with:

```env
# Server
PORT=8000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/future-viz

# Security
JWT_SECRET=generate_a_long_random_string_here
JWT_EXPIRY=30d

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# AI Services (optional)
OPENAI_API_KEY=your_openai_key
REPLICATE_API_TOKEN=your_replicate_token

# Frontend
FRONTEND_URL=https://your-frontend-domain.com
```

---

## Security Considerations

### 1. CORS Configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 2. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

### 3. HTTPS
- Always use HTTPS in production
- Get SSL certificate (Let's Encrypt free)

### 4. Environment Variables
- Never commit `.env` file
- Use secrets management in deployment platform
- Rotate secrets regularly

### 5. Database Security
- Use strong passwords
- Enable authentication
- Setup backups
- Use connection pooling

---

## Monitoring & Logging

### Application Logging
```javascript
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Uptime Monitoring
- Use services like Uptime Robot
- Monitor API response times
- Set up alerts for downtime

### Error Tracking
- Integrate Sentry or similar
- Track frontend and backend errors
- Get alerts for critical errors

---

## Performance Optimization

### 1. Database Indexing
```javascript
userSchema.index({ phoneNumber: 1 });
transformationSchema.index({ userId: 1, createdAt: -1 });
```

### 2. Caching
```javascript
const redis = require('redis');
const client = redis.createClient();
```

### 3. Image Optimization
- Compress images before upload
- Use CDN for image serving
- Set appropriate cache headers

### 4. API Optimization
- Implement pagination
- Use field filtering
- Add response caching

---

## Scaling Strategy

### Horizontal Scaling
- Load balancer (Nginx/HAProxy)
- Multiple backend instances
- Shared MongoDB database

### Vertical Scaling
- More CPU/RAM
- Database optimization
- Better network

---

## Rollback Plan

1. **Keep previous version deployed**
2. **Test all changes in staging**
3. **Database migrations with rollback script**
4. **Quick revert capability**

---

## Domain & DNS Setup

1. **Register domain** (Namecheap, GoDaddy, etc.)
2. **Point DNS to hosting:**
   - Frontend: `A record` → Vercel/Netlify IP
   - Backend: `A record` → Railway/Heroku/Server IP
3. **Setup SSL certificate**
4. **Test connectivity**

---

## Post-Deployment Checklist

- [ ] Frontend accessible and loading
- [ ] Backend API responding
- [ ] OTP sending working
- [ ] Database connected and synced
- [ ] Image uploads working
- [ ] SSL certificate valid
- [ ] Error logging configured
- [ ] Monitoring alerts set up
- [ ] Backups scheduled
- [ ] Performance acceptable

---

## Troubleshooting Deployment

### Frontend not loading
```bash
# Check build
npm run build
# Check network tab in DevTools
# Verify API_URL environment variable
```

### Backend not responding
```bash
# Check logs
pm2 logs future-viz-backend
# Verify environment variables
# Check MongoDB connection
```

### Images not uploading
```bash
# Verify uploads/ directory permissions
# Check file size limits
# Verify storage quota
```

### OTP not sending
```bash
# Verify Twilio credentials
# Check phone number format
# Check Twilio account balance
```

---

## Cost Estimation (Monthly)

| Service | Free Tier | Paid |
|---------|-----------|------|
| Frontend (Vercel) | ✅ Free | $20+ |
| Backend (Railway) | ✅ $5 credit | $10+ |
| MongoDB (Atlas) | ✅ Free | $10-57+ |
| Twilio (SMS) | ❌ | $0.0075 per SMS |
| Total | ~$5/month | $50-100/month |

---

## Support

For deployment issues:
1. Check logs: `pm2 logs` or platform dashboard
2. Verify environment variables
3. Test API endpoints with Postman
4. Check database connectivity
5. Review security settings
