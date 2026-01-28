#!/bin/bash
# Future Viz Installation Script

echo "🚀 Future Viz - Installation Script"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ NPM found: $(npm --version)"

# Install Backend
echo ""
echo "📦 Installing Backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend installation failed"
    exit 1
fi

# Create .env file
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your credentials"
    echo "   - TWILIO_ACCOUNT_SID"
    echo "   - TWILIO_AUTH_TOKEN"
    echo "   - JWT_SECRET"
fi

cd ..

# Install Frontend
echo ""
echo "📦 Installing Frontend dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend installation failed"
    exit 1
fi

cd ..

echo ""
echo "============================================"
echo "✅ Installation Complete!"
echo "============================================"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Configure Backend:"
echo "   - Edit backend/.env with your Twilio credentials"
echo "   - Ensure MongoDB is running"
echo ""
echo "2. Start Backend (Terminal 1):"
echo "   cd backend && npm run dev"
echo ""
echo "3. Start Frontend (Terminal 2):"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open Browser:"
echo "   http://localhost:3000"
echo ""
echo "Happy coding! 🎉"
