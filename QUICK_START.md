# 📖 QUICK START GUIDE - Future Viz

Welcome! This guide will get you up and running in minutes.

## 🎯 What is Future Viz?

An AI-powered app where students visualize their future by seeing themselves transformed into their dream careers (Pilot, Doctor, Teacher, Engineer, etc.)

## ⚡ Quick Setup (5 minutes)

### Step 1: Prerequisites
- **Node.js 14+** - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
- **Twilio Account** - [Free trial](https://www.twilio.com/)

### Step 2: Clone & Install

**Windows:**
```bash
# Navigate to the folder and run:
install.bat
```

**Mac/Linux:**
```bash
chmod +x install.sh
./install.sh
```

**Or manually:**
```bash
# Backend
cd backend
npm install
cp .env.example .env

# Frontend (new terminal)
cd frontend
npm install
```

### Step 3: Configure

Edit `backend/.env`:
```env
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
JWT_SECRET=generate_random_string_here
```

### Step 4: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Visit:** `http://localhost:3000`

## 🔐 Getting Twilio Credentials (2 minutes)

1. Go to [https://www.twilio.com/](https://www.twilio.com/)
2. Sign up for free trial (get $15 credit)
3. Go to Console Dashboard
4. Copy your **Account SID** and **Auth Token**
5. Get a **Twilio Phone Number** (free)
6. Paste these into `backend/.env`

## 📱 How to Use the App

1. **Login** - Enter any phone number (e.g., +919876543210)
2. **Get OTP** - Check console (backend prints it) or Twilio logs
3. **Verify** - Enter the OTP
4. **Chat** - Tell the AI what you want to become
5. **Photo** - Take a picture or upload one
6. **Transform** - AI transforms your photo
7. **Gallery** - View all your transformations

## 📁 Project Structure

```
future/
├── backend/              # Node.js + Express
│   ├── src/
│   │   ├── config/       # Database & Twilio setup
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Database schemas
│   │   ├── routes/       # API endpoints
│   │   └── index.js      # Main server file
│   ├── .env.example
│   └── package.json
│
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── README.md             # Full documentation
├── APP_OVERVIEW.md       # Feature overview
├── DEVELOPMENT.md        # Dev guide
├── DEPLOYMENT.md         # Production guide
└── API_DOCUMENTATION.md  # API reference
```

## 🛠️ Common Issues

### "OTP not sending"
- Check `backend/.env` has Twilio credentials
- Verify phone number format: `+country_code_number`
- Check Twilio console for SMS activity

### "Can't connect to MongoDB"
- Ensure MongoDB is running: `mongod`
- Or use MongoDB Atlas (cloud): update `MONGODB_URI` in `.env`

### "Frontend can't connect to backend"
- Both servers must be running
- Check `http://localhost:5000/api/health` in browser
- Verify proxy in `frontend/vite.config.js`

### "Image upload fails"
- Create `backend/uploads/` folder
- Check folder permissions
- Verify file size (max 5MB)

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [README.md](README.md) | Full documentation |
| [APP_OVERVIEW.md](APP_OVERVIEW.md) | Feature overview & architecture |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Development guide & tips |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guide |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Complete API reference |

## 🚀 Deploy to Production

### Simple Deploy (Recommended)

**Frontend → Vercel:**
```bash
npm install -g vercel
cd frontend
vercel
```

**Backend → Railway:**
1. Push code to GitHub
2. Connect to Railway.app
3. Add MongoDB
4. Set environment variables
5. Auto-deploys on push

See [DEPLOYMENT.md](DEPLOYMENT.md) for more options.

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB |
| Auth | JWT + OTP via Twilio |
| Image Processing | Replicate (ready to integrate) |

## 🎓 Next Steps

1. ✅ Get it running locally (5 min)
2. 📖 Read [APP_OVERVIEW.md](APP_OVERVIEW.md) (10 min)
3. 🔧 Explore code structure (15 min)
4. 🚀 Deploy to production (30 min)

## 🤝 Contributing

Feel free to:
- Add more career options
- Improve the chatbot
- Add new features
- Fix bugs
- Improve UI/UX

## 📞 Support

- **Backend issues** - Check `backend/README.md`
- **Frontend issues** - Check `frontend/README.md`
- **Deployment help** - See [DEPLOYMENT.md](DEPLOYMENT.md)
- **API questions** - See [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## 📝 Environment Variables Checklist

**Backend `.env` Required:**
- [ ] `MONGODB_URI` - Database connection
- [ ] `JWT_SECRET` - Token secret
- [ ] `TWILIO_ACCOUNT_SID` - Twilio credential
- [ ] `TWILIO_AUTH_TOKEN` - Twilio credential
- [ ] `TWILIO_PHONE_NUMBER` - Your Twilio number

**Optional but Recommended:**
- [ ] `REPLICATE_API_TOKEN` - For real AI image transformation
- [ ] `OPENAI_API_KEY` - For advanced chatbot

## 🎉 You're Ready!

Everything is set up. Start the servers and enjoy building! 🚀

---

**Questions?** Check the documentation files or review the code comments.

**Want to contribute?** Great! Submit pull requests or open issues.

**Found a bug?** Let us know in the issues section.

Happy coding! 💻
