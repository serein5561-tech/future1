# Future Viz - App Development Guide

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 2. Frontend Setup (in another terminal)
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

## Architecture

### User Flow
1. Student enters mobile number → receives OTP via SMS
2. Verifies OTP → logged in with JWT token
3. Chats with AI to select desired career
4. Takes/uploads photo
5. Photo transformed using AI to show student as their chosen career
6. Views all transformations in gallery

### Key Components

**Authentication System**
- Twilio SMS for OTP delivery
- JWT tokens for session management
- Secure password-less login

**Chatbot Engine**
- Simple career matching logic
- Can be enhanced with NLP

**Photo Transformation**
- Multer for file upload
- Replicate/DALL-E integration ready
- Status tracking for async processing

**Image Gallery**
- Browse all transformations
- Filter by career
- Download/share options

## Important Configuration

### Twilio (SMS/OTP)
- Get Account SID and Auth Token from Twilio Dashboard
- Set up a verified phone number
- Add credentials to backend `.env`

### AI Image Transformation
Options for implementation:
- **Replicate** - Runs open-source models
- **DALL-E API** - OpenAI's generation model
- **Stable Diffusion** - Open-source alternative
- **Custom Model** - Fine-tuned transformation model

### Database
- MongoDB connection string in backend `.env`
- Collections: Users, Transformations

## Development Notes

### Adding New Careers
Edit `backend/src/controllers/chatbotController.js` - `careerOptions` array

### Styling
- Gradient theme: #667eea to #764ba2
- Responsive design for mobile-first
- CSS modules for component styles

### API Rate Limiting
Consider adding rate limiting for OTP sending:
```javascript
// In production, implement rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
});
app.post('/api/auth/send-otp', limiter, sendOTPToPhone);
```

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist folder
```

### Backend (Heroku/Railway)
```bash
# Set environment variables
# Deploy to platform
```

## Testing

### Manual Testing Checklist
- [ ] OTP login flow
- [ ] Career selection
- [ ] Photo upload
- [ ] Photo transformation
- [ ] Gallery display
- [ ] Logout functionality

## Troubleshooting

**Issue: OTP not sending**
- Check Twilio credentials
- Verify phone number format (+country_code)
- Check Twilio account balance

**Issue: Photo upload fails**
- Ensure uploads/ directory exists
- Check file size limits
- Verify CORS configuration

**Issue: Image transformation timeout**
- Check AI API status
- Increase timeout duration
- Verify API credentials

## Next Steps

1. Integrate real AI transformation API
2. Add email notifications
3. Implement career recommendations
4. Add progress tracking
5. Create teacher/parent dashboard
6. Add multilingual support
7. Implement push notifications
8. Add social features (share, challenge friends)

## Support & Resources

- Twilio Docs: https://www.twilio.com/docs
- React Documentation: https://react.dev
- Express.js Guide: https://expressjs.com
- MongoDB Manual: https://docs.mongodb.com
- Replicate API: https://replicate.com/docs
