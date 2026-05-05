@echo off
echo Starting IPA Chat Grid 3 Edition...
echo.
echo The app will open at: http://localhost:8000/minimal-ipa-chat.html
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
python -m http.server 8000

if errorlevel 1 (
    echo.
    echo ERROR: Python not found or failed to start.
    echo.
    echo Please install Python or use an alternative method:
    echo - Node.js: npx http-server -p 8000
    echo - PHP: php -S localhost:8000
    echo.
    pause
)