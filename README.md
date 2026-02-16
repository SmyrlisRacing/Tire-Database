# Track‑Datenserver – Architektur & Konzeptdokumentation

> **⚠️ Hinweis:** Die Synchronisation zum HQ‑NAS ist aktuell noch nicht verfügbar. Alle NAS‑bezogenen Features (Sync‑Service, Sync‑Center, Master DB) sind geplant, aber noch nicht implementiert.

---

## Inhaltsverzeichnis

1. [Projektziel](#1-projektziel)
2. [Hardware‑Setup](#2-hardware-setup)
3. [Software‑Architektur](#3-software-architektur)
4. [Netzwerk‑Design](#4-netzwerk-design)
5. [Web‑UI Konzept](#5-web-ui-konzept)
6. [Datenpipeline](#6-datenpipeline)
7. [Speicherbedarf](#7-speicherbedarf)
8. [Empfehlungen & Best Practices](#8-empfehlungen--best-practices)

---

## 1. Projektziel

Das Ziel ist die Einführung einer zentralen Datenplattform für das Rennteam, um alle relevanten Informationen wie Reifendaten, Fahrzeugdaten, Telemetrie und Session‑Informationen strukturiert zu erfassen, zu speichern und auszuwerten.

**Der Fokus liegt auf:**

- Edge‑Computing am Track (lokaler Server, unabhängig vom Internet)
- Zentralisierung aller Daten statt verstreuter Dateien auf vielen Laptops
- Synchronisation zum HQ‑NAS nach Rennwochenenden *(noch nicht verfügbar)*
- Einheitlicher Zugriff für Ingenieure über eine Web‑UI

---

## 2. Hardware‑Setup

### Raspberry Pi 4 als Edge‑Server

Der Pi dient als lokaler Datenserver am Track.

**Empfohlene Konfiguration:**

| Komponente | Empfehlung |
|---|---|
| Board | Raspberry Pi 4 (4–8 GB RAM) |
| Speicher | USB‑SSD oder NVMe‑SSD im USB‑Gehäuse |
| SD‑Karte | Keine SD‑Karte für Datenbankbetrieb |
| Kühlung | Aktive Kühlung |
| Netzwerk | Statische IP‑Adresse |
| Gehäuse | Optional: Flightcase oder 3D‑gedrucktes Server‑Case |

### Netzwerk

- Direkte LAN‑Verbindung Laptop ↔ Pi
- oder 5‑Port‑Gigabit‑Switch für mehrere Ingenieure

**Statische IP Beispiel:**

```
Pi:     192.168.50.10
Laptop: 192.168.50.20
```

---

## 3. Software‑Architektur

### Docker‑basierter Stack

Der gesamte Server läuft containerisiert:

| Service | Technologie |
|---|---|
| Datenbank | PostgreSQL oder SQLite |
| Backend | FastAPI oder Node.js |
| Frontend | React oder Svelte |
| Reverse Proxy | Nginx oder Traefik |
| Sync‑Service | Pi → HQ‑NAS *(noch nicht verfügbar)* |

**Vorteile:**

- Stabil
- Leicht wartbar
- Schnell
- Offline‑fähig
- Perfekt für Edge‑Computing

**Speicherbedarf:**

Der komplette Stack benötigt **1–2 GB Speicherplatz**. Der Rest der SSD ist für Daten reserviert.

---

## 4. Netzwerk‑Design

### Direktverbindung

```
Laptop → LAN‑Kabel → Pi
```

Browser öffnet Web‑UI: `http://192.168.50.10:8080`

### Switch‑Variante

```
Pi + mehrere Laptops → Switch → gemeinsamer Zugriff
```

> WLAN optional deaktivieren – für maximale Stabilität und Sicherheit.

---

## 5. Web‑UI Konzept

Die Web‑UI dient als zentrale Oberfläche für alle Ingenieure.

### Dashboard

- Systemstatus
- Speicherplatz
- Anzahl Datensätze
- Session‑Übersicht
- Quick Actions (Session starten, Sync, Backup)

### Reifendaten‑Modul

- Reifensätze anlegen
- Drücke / Temperaturen erfassen
- Historie pro Satz
- Graphen & Tabellen
- CSV‑Export

### Fahrzeugdaten‑Modul

- Setup‑Sheets
- Aero‑Pakete
- Fuel‑Runs
- Stint‑Daten
- Setup‑Vergleich (Diff)

### Telemetrie‑Viewer *(optional)*

- Speed
- Brake
- Throttle
- Steering
- GPS‑Map
- Delta‑Vergleich

### Sync‑Center *(noch nicht verfügbar)*

- Manuelles Sync
- Automatisches Sync nach Sessions
- Logs
- Übertragungsstatus

### Admin‑Panel

- Backups
- Logs
- Netzwerk‑Konfiguration
- Docker‑Status

---

## 6. Datenpipeline

```
Auto → Logger → Raspberry Pi (Edge DB) → Sync → HQ NAS (Master DB)
                                           ↑
                                   ⚠️ NAS noch nicht verfügbar
```

**Vorteile:**

- Offline‑fähig
- Keine Daten auf Laptops
- Zentrale Quelle der Wahrheit
- Reproduzierbare Datenhistorie

---

## 7. Speicherbedarf

### Tech‑Stack

**1–2 GB**

### Datenbedarf (realistisch)

| Datentyp | Volumen |
|---|---|
| Reifendaten | ~ 100 MB|
| Telemetrie | 20 GB pro Wochenende / Auto|

**Empfehlung:** 256–512 GB SSD für den Pi

---

## 8. Empfehlungen & Best Practices

- SSD statt SD‑Karte
- Statische IP
- Docker‑Compose
- Offline‑First Architektur
- Pi 4 ausreichend
- Pi 5 optional für mehr Telemetrie‑Last
- Switch für mehrere Ingenieure
