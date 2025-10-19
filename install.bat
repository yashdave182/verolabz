@echo off
echo ================================================================================
echo Document Tweaker - Installation Script
echo ================================================================================
echo.
echo This will install all required packages. Please wait...
echo.

REM Check Python
echo [Step 1/4] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed!
    echo Please install Python 3.9+ from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)
python --version
echo.

REM Create virtual environment
echo [Step 2/4] Creating virtual environment...
if exist venv (
    echo Virtual environment already exists, skipping...
) else (
    python -m venv venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created successfully!
)
echo.

REM Install Python packages
echo [Step 3/4] Installing Python packages (this may take 2-3 minutes)...
echo Please wait...
venv\Scripts\python.exe -m pip install --upgrade pip --quiet
venv\Scripts\python.exe -m pip install flask flask-cors google-generativeai requests python-dotenv --quiet
if errorlevel 1 (
    echo [ERROR] Failed to install Python packages
    echo Trying again with verbose output...
    venv\Scripts\python.exe -m pip install flask flask-cors google-generativeai requests python-dotenv
    pause
    exit /b 1
)
echo Python packages installed successfully!
echo.

REM Install Node packages
echo [Step 4/4] Installing Node.js packages (this may take 3-5 minutes)...
echo Please wait...
node --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Node.js is not installed!
    echo You can install it later from https://nodejs.org/
    echo Backend will still work without it.
) else (
    if exist node_modules (
        echo Node modules already installed, skipping...
    ) else (
        call npm install --silent
        if errorlevel 1 (
            echo [WARNING] Failed to install Node packages
            echo You can try running: npm install
        ) else (
            echo Node.js packages installed successfully!
        )
    )
)
echo.

REM Create directories
if not exist uploads mkdir uploads
if not exist processed mkdir processed

echo ================================================================================
echo Installation Complete!
echo ================================================================================
echo.
echo Next steps:
echo 1. Configure your API keys:
echo    - Copy .env.example to .env
echo    - Edit .env and add your Unstract and Gemini API keys
echo.
echo 2. Start the backend:
echo    - Double-click run_backend.bat
echo    - OR run: venv\Scripts\python.exe backend_api.py
echo.
echo 3. Start the frontend (in another window):
echo    - Double-click run_frontend.bat
echo    - OR run: npm run dev
echo.
echo 4. Open browser to: http://localhost:5173/enhanced-doc-tweaker
echo.
pause
