# Backend Setup Guide

## Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/future-viz
JWT_SECRET=your_secret_key_change_this
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
OPENAI_API_KEY=your_openai_key
REPLICATE_API_TOKEN=your_replicate_token
```

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## Production

Start the server:
```bash
npm start
```

## Database Setup

Make sure MongoDB is running locally or update `MONGODB_URI` in `.env` to point to your MongoDB instance.

```bash
# If using local MongoDB
mongod
```

## File Structure

- `src/config/` - Configuration files (database, Twilio)
- `src/models/` - MongoDB schemas
- `src/controllers/` - Request handlers
- `src/routes/` - API routes
- `src/middleware/` - Express middleware
- `src/index.js` - Main entry point

## Authentication

The app uses JWT for authenticated requests. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Image Upload

Images are stored in the `uploads/` directory. Create this folder:

```bash
mkdir uploads
```

Add to `.gitignore` to prevent committing uploads.
