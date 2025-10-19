@echo off
echo ================================================================================
echo Document Tweaker - Frontend Server
echo ================================================================================
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo [ERROR] node_modules not found!
    echo Please run setup.bat first
    echo.
    pause
    exit /b 1
)

REM Check if package.json exists
if not exist package.json (
    echo [ERROR] package.json not found!
    echo Make sure you're in the correct directory
    echo.
    pause
    exit /b 1
)

echo Starting Vite development server...
echo.
echo Frontend will run on: http://localhost:5173
echo Enhanced UI: http://localhost:5173/enhanced-doc-tweaker
echo.
echo Press Ctrl+C to stop the server
echo.
echo ================================================================================
echo.

REM Run frontend development server
call npm run dev

REM If the above fails, show error
if errorlevel 1 (
    echo.
    echo [ERROR] Frontend failed to start
    echo.
    echo Common issues:
    echo 1. Node.js not installed
    echo 2. Dependencies not installed (run setup.bat)
    echo 3. Port 5173 already in use
    echo.
    pause
)
