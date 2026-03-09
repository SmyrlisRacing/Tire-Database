@echo off
echo ================================================
echo   Track-Datenserver - Reifendatenbank
echo ================================================
echo.

:: Node.js pruefen
node --version >nul 2>&1
if errorlevel 1 (
    echo FEHLER: Node.js ist nicht installiert oder nicht im PATH.
    echo Bitte installiere Node.js von https://nodejs.org/
    pause
    exit /b 1
)

:: Abhaengigkeiten installieren
if not exist "node_modules" (
    echo Installiere Abhaengigkeiten...
    npm install
)

:: Server starten
echo.
echo ================================================
echo   Server wird gestartet...
echo   Oeffne im Browser: http://localhost:5000
echo   Zum Beenden: Ctrl+C
echo ================================================
echo.
node server.js
