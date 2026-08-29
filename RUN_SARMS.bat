@echo off
:: ============================================================
:: SARMS - Complete Auto-Fix Script
:: Run this from inside your sarms-react folder
:: Double-click this file OR run it from Command Prompt
:: ============================================================

echo.
echo ===================================================
echo   SARMS - Complete Setup Fix
echo ===================================================
echo.

:: Step 1 - Check XAMPP is running
echo [1/6] Checking XAMPP Apache...
curl -s http://localhost/ > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Apache is NOT running!
    echo Please open XAMPP Control Panel and START Apache and MySQL first.
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)
echo       Apache is running OK

:: Step 2 - Find this script's folder (sarms-react folder)
set "SARMS_REACT=%~dp0"
set "SARMS_REACT=%SARMS_REACT:~0,-1%"
echo [2/6] Project folder: %SARMS_REACT%

:: Step 3 - Copy api folder to XAMPP htdocs\sarms-react\
echo [3/6] Copying api\db.php to XAMPP...
if not exist "C:\xampp\htdocs\sarms-react" mkdir "C:\xampp\htdocs\sarms-react"
if not exist "C:\xampp\htdocs\sarms-react\api" mkdir "C:\xampp\htdocs\sarms-react\api"
copy /Y "%SARMS_REACT%\api\db.php" "C:\xampp\htdocs\sarms-react\api\db.php" > nul
echo       db.php copied to C:\xampp\htdocs\sarms-react\api\

:: Step 4 - Test PHP is working
echo [4/6] Testing PHP + MySQL connection...
curl -s "http://localhost/sarms-react/api/db.php?action=ping" > "%TEMP%\sarms_ping.txt" 2>&1
type "%TEMP%\sarms_ping.txt" | findstr /C:"ok" > nul
if %errorlevel% neq 0 (
    echo.
    echo ERROR: PHP test failed! Response was:
    type "%TEMP%\sarms_ping.txt"
    echo.
    echo Possible causes:
    echo  - MySQL is not running ^(start it in XAMPP Control Panel^)
    echo  - Database sarms_db not created ^(import sarms_database.sql in phpMyAdmin^)
    echo  - Wrong DB password in api\db.php
    echo.
    echo Open this URL in your browser to see the exact error:
    echo   http://localhost/sarms-react/api/db.php?action=ping
    echo.
    pause
    exit /b 1
)
echo       PHP + MySQL OK!

:: Step 5 - Clean old node_modules and reinstall
echo [5/6] Installing correct npm packages ^(Vite 5.4.0^)...
if exist "%SARMS_REACT%\node_modules" (
    echo       Removing old node_modules...
    rmdir /s /q "%SARMS_REACT%\node_modules"
)
if exist "%SARMS_REACT%\package-lock.json" del /f "%SARMS_REACT%\package-lock.json"
cd /d "%SARMS_REACT%"
call npm install --save-exact vite@5.4.0 @vitejs/plugin-react@4.2.1 > nul 2>&1
call npm install react@18.2.0 react-dom@18.2.0 > nul 2>&1
echo       npm packages installed

:: Step 6 - Start the dev server
echo [6/6] Starting SARMS dev server...
echo.
echo ===================================================
echo   SUCCESS! SARMS is starting...
echo.  
echo   Open your browser and go to:
echo   http://localhost:5173
echo.
echo   The app connects to XAMPP MySQL automatically.
echo   Press Ctrl+C to stop the server.
echo ===================================================
echo.
call npm run dev

pause
