@echo off
echo ================================================================================
echo Document Tweaker - Manual Setup
echo ================================================================================
echo.

echo Step 1: Creating Python virtual environment...
python -m venv venv
if errorlevel 1 (
    echo [ERROR] Failed to create virtual environment
    echo Make sure Python is installed and in PATH
    pause
    exit /b 1
)
echo [OK] Virtual environment created
echo.

echo Step 2: Installing Python dependencies...
venv\Scripts\python.exe -m pip install --upgrade pip
venv\Scripts\python.exe -m pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install Python packages
    pause
    exit /b 1
)
echo [OK] Python packages installed
echo.

echo Step 3: Installing Node.js dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install Node.js packages
    pause
    exit /b 1
)
echo [OK] Node.js packages installed
echo.

echo Step 4: Creating required directories...
if not exist uploads mkdir uploads
if not exist processed mkdir processed
echo [OK] Directories created
echo.

echo ================================================================================
echo Setup Complete!
echo ================================================================================
echo.
echo Next steps:
echo 1. Configure your API keys in .env file
echo 2. Run: run_backend.bat (in one terminal)
echo 3. Run: run_frontend.bat (in another terminal)
echo.
pause
