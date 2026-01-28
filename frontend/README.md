# Frontend Setup Guide

## Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

- `src/pages/` - Page components
  - `Login.jsx` - OTP authentication
  - `Dashboard.jsx` - Main dashboard
  - `Chatbot.jsx` - Career selection chatbot
  - `PhotoTransform.jsx` - Photo transformation
  - `Gallery.jsx` - View transformations
- `src/App.jsx` - Main app component with routing
- `src/main.jsx` - React entry point
- `src/index.css` - Global styles

## Configuration

Update the API base URL in `vite.config.js` if your backend runs on a different port:

```javascript
proxy: {
  '/api': 'http://localhost:5000'
}
```

## Features Breakdown

### Login Page
- Mobile number input with validation
- OTP verification
- JWT token storage

### Dashboard
- Navigation to all features
- User profile overview
- Quick access cards

### Chatbot
- Interactive career selection
- Real-time responses
- Career confirmation

### Photo Transform
- Camera access
- File upload
- Real-time preview
- Image transformation processing

### Gallery
- Display all transformations
- Career and date information
- Status tracking

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Lazy loading for routes
- Image optimization
- Code splitting
- CSS modules for scoping
