@echo off
echo ================================================================================
echo Document Tweaker - AI-Powered Document Enhancement
echo ================================================================================
echo.

REM Check if .env file exists
if not exist .env (
    echo [ERROR] .env file not found!
    echo Please copy .env.example to .env and configure your API keys.
    echo.
    pause
    exit /b 1
)

echo [1/4] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.9 or higher
    pause
    exit /b 1
)
echo [OK] Python is installed
echo.

echo [2/4] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js 18 or higher
    pause
    exit /b 1
)
echo [OK] Node.js is installed
echo.

echo [3/4] Installing dependencies...
echo.

REM Check if virtual environment exists
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Install Python dependencies
echo Installing Python dependencies...
if exist venv\Scripts\pip.exe (
    venv\Scripts\pip.exe install -r requirements.txt
) else (
    python -m pip install -r requirements.txt
)

if errorlevel 1 (
    echo [WARNING] Some Python packages might have issues
)
echo [OK] Python dependencies installed
echo.

REM Install Node dependencies if needed
if not exist node_modules (
    echo Installing Node.js dependencies...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install Node.js dependencies
        pause
        exit /b 1
    )
)
echo [OK] Node.js dependencies installed
echo.

echo [4/4] Starting servers...
echo.
echo ================================================================================
echo Backend Server: http://localhost:5000
echo Frontend Server: http://localhost:5173
echo Enhanced UI: http://localhost:5173/enhanced-doc-tweaker
echo ================================================================================
echo.
echo Press Ctrl+C in either window to stop the servers
echo.

REM Start backend in new window
if exist venv\Scripts\python.exe (
    start "Document Tweaker - Backend (Flask)" cmd /k "venv\Scripts\python.exe backend_api.py"
) else (
    start "Document Tweaker - Backend (Flask)" cmd /k "python backend_api.py"
)

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
start "Document Tweaker - Frontend (Vite)" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Check the new terminal windows for status
echo.
echo To stop: Close both terminal windows or press Ctrl+C in each
echo.
pause
