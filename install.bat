@echo off
REM Future Viz Installation Script for Windows

echo.
echo 🚀 Future Viz - Installation Script
echo ====================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install it first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

echo ✅ NPM found:
npm --version

REM Install Backend
echo.
echo 📦 Installing Backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Backend installation failed
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

REM Create .env file
if not exist .env (
    echo.
    echo 📝 Creating .env file from example...
    copy .env.example .env
    echo ⚠️  Please update backend\.env with your credentials
    echo    - TWILIO_ACCOUNT_SID
    echo    - TWILIO_AUTH_TOKEN
    echo    - JWT_SECRET
)

cd ..

REM Install Frontend
echo.
echo 📦 Installing Frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend installation failed
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

cd ..

echo.
echo ============================================
echo ✅ Installation Complete!
echo ============================================
echo.
echo 📋 Next Steps:
echo.
echo 1. Configure Backend:
echo    - Edit backend\.env with your Twilio credentials
echo    - Ensure MongoDB is running
echo.
echo 2. Start Backend (Terminal 1):
echo    cd backend ^&^& npm run dev
echo.
echo 3. Start Frontend (Terminal 2):
echo    cd frontend ^&^& npm run dev
echo.
echo 4. Open Browser:
echo    http://localhost:3000
echo.
echo Happy coding! 🎉
echo.
pause
