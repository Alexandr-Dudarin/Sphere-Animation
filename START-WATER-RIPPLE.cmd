@echo off
setlocal
cd /d "%~dp0sphere-visual-lab"
where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js and npm are required. Install Node.js LTS and try again.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  call npm ci --no-audit --no-fund
  if errorlevel 1 (
    echo Dependency installation failed. Please send the terminal output.
    pause
    exit /b 1
  )
)
echo.
echo Sphere Visual Lab - Water Ripple V4
echo Open http://127.0.0.1:5174/#water-ripple after Vite is ready.
echo Keep this window open while viewing the demo. Ctrl+C stops the server.
echo.
call npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
pause
