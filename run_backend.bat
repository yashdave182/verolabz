@echo off
echo ================================================================================
echo Document Tweaker - Backend Server
echo ================================================================================
echo.

REM Check if .env file exists
if not exist .env (
    echo [ERROR] .env file not found!
    echo.
    echo Please follow these steps:
    echo 1. Copy .env.example to .env:
    echo    copy .env.example .env
    echo.
    echo 2. Edit .env and add your API keys:
    echo    notepad .env
    echo.
    echo 3. Get your API keys from:
    echo    - Unstract: https://unstract.com/
    echo    - Gemini: https://makersuite.google.com/app/apikey
    echo.
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist venv\Scripts\python.exe (
    echo [ERROR] Virtual environment not found!
    echo.
    echo Please run the installation first:
    echo    install.bat
    echo.
    echo Or create it manually:
    echo    python -m venv venv
    echo    venv\Scripts\python.exe -m pip install flask flask-cors google-generativeai requests python-dotenv
    echo.
    pause
    exit /b 1
)

REM Check if Flask is installed
venv\Scripts\python.exe -c "import flask" 2>nul
if errorlevel 1 (
    echo [ERROR] Flask is not installed!
    echo.
    echo Installing required packages now...
    venv\Scripts\python.exe -m pip install flask flask-cors google-generativeai requests python-dotenv
    if errorlevel 1 (
        echo [ERROR] Failed to install packages
        echo.
        echo Please run: install.bat
        pause
        exit /b 1
    )
)

echo Starting Flask backend server...
echo.
echo Backend will run on: http://localhost:5000
echo Health check: https://doctweaker.vercel.app/health
echo.
echo Press Ctrl+C to stop the server
echo.
echo ================================================================================
echo.

REM Run backend with virtual environment Python
venv\Scripts\python.exe backend_api.py

REM If the backend exits, show error info
if errorlevel 1 (
    echo.
    echo ================================================================================
    echo [ERROR] Backend server stopped with an error
    echo ================================================================================
    echo.
    echo Common issues:
    echo.
    echo 1. API keys not configured:
    echo    - Open .env file
    echo    - Add your Unstract and Gemini API keys
    echo    - Make sure there are no quotes or extra spaces
    echo.
    echo 2. Missing packages:
    echo    - Run: install.bat
    echo.
    echo 3. Port 5000 already in use:
    echo    - Close other applications using port 5000
    echo    - Or change the port in backend_api.py
    echo.
    echo 4. Check the error message above for more details
    echo.
    pause
)
