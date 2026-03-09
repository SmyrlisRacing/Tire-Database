#!/bin/bash
echo "================================================"
echo "  Track-Datenserver – Reifendatenbank"
echo "================================================"
echo ""

# Node.js prüfen
if ! command -v node &> /dev/null; then
    echo "FEHLER: Node.js ist nicht installiert."
    echo "Installiere mit: sudo apt install nodejs npm"
    exit 1
fi

# Abhängigkeiten installieren
if [ ! -d "node_modules" ]; then
    echo "Installiere Abhängigkeiten..."
    npm install
fi

# Server starten
echo ""
echo "================================================"
echo "  Server wird gestartet..."
echo "  Öffne im Browser: http://localhost:5000"
echo "  Auf dem Pi erreichbar unter:"
echo "    http://$(hostname -I | awk '{print $1}'):5000"
echo "  Zum Beenden: Ctrl+C"
echo "================================================"
echo ""
node server.js
