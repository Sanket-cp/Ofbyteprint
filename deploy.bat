@echo off
echo 🚀 Starting PrintHub deployment process...

echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Frontend dependency installation failed
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Backend dependency installation failed
    pause
    exit /b 1
)
cd ..

echo 🔨 Building application...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully!

echo 📦 Creating deployment package...
if not exist deployment mkdir deployment
if exist dist xcopy /E /I /Y dist deployment\frontend
xcopy /E /I /Y backend deployment\backend
if exist deployment\backend\node_modules rmdir /S /Q deployment\backend\node_modules

echo.
echo 🎉 Deployment preparation completed!
echo.
echo Next steps:
echo 1. 📤 Push your code to GitHub
echo 2. 🌐 Deploy frontend to Vercel/Netlify  
echo 3. 🖥️  Deploy backend to Railway/Render
echo 4. 🔧 Set environment variables on hosting platforms
echo 5. 🔍 Submit sitemap to Google Search Console
echo.
echo For detailed instructions, see DEPLOYMENT.md
echo.
pause