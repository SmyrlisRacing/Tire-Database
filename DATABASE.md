# Datenbank Dokumentation – Tire Database

## Übersicht

1. **Reifendruck** – Erfassung aller Druck-, Temperatur- und Sessiondaten pro Reifensatz
2. **Laufzeiten Übersicht Reifen** – Laufleistung je Einzelreifen
3. **Laufzeiten Übersicht Felgen** – Laufleistung je Felge

---

## 1. Reifendruck

Zentrale Tabelle für die Erfassung von Reifendruck- und Temperaturdaten pro Session/Einsatz.

| Feld | Beschreibung |
|------|-------------|
| Set Nr. | Nummer des Reifensatzes |
| Felgen Nr. | Zugeordnete Felgennummer |
| Marke | Reifenhersteller |
| Bezeichnung VA | Reifenbezeichnung Vorderachse |
| Bezeichnung HA | Reifenbezeichnung Hinterachse |
| Bar-Code Reifen VL | Barcode vorne links |
| Bar-Code Reifen VR | Barcode vorne rechts |
| Bar-Code Reifen HL | Barcode hinten links |
| Bar-Code Reifen HR | Barcode hinten rechts |
| Kaltdruck VL | Kaltdruck vorne links (bar) |
| Kaltdruck VR | Kaltdruck vorne rechts (bar) |
| Kaltdruck HL | Kaltdruck hinten links (bar) |
| Kaltdruck HR | Kaltdruck hinten rechts (bar) |
| Warmdruck VL | Warmdruck vorne links (bar) |
| Warmdruck VR | Warmdruck vorne rechts (bar) |
| Warmdruck HL | Warmdruck hinten links (bar) |
| Warmdruck HR | Warmdruck hinten rechts (bar) |
| RDK-Druck VL | Reifendruckkontrolle vorne links (bar) |
| RDK-Druck VR | Reifendruckkontrolle vorne rechts (bar) |
| RDK-Druck HL | Reifendruckkontrolle hinten links (bar) |
| RDK-Druck HR | Reifendruckkontrolle hinten rechts (bar) |
| Laufflächentemp. VL außen | Laufflächentemperatur vorne links – außen (°C) |
| Laufflächentemp. VL mitte | Laufflächentemperatur vorne links – mitte (°C) |
| Laufflächentemp. VL innen | Laufflächentemperatur vorne links – innen (°C) |
| Laufflächentemp. VR außen | Laufflächentemperatur vorne rechts – außen (°C) |
| Laufflächentemp. VR mitte | Laufflächentemperatur vorne rechts – mitte (°C) |
| Laufflächentemp. VR innen | Laufflächentemperatur vorne rechts – innen (°C) |
| Laufflächentemp. HL außen | Laufflächentemperatur hinten links – außen (°C) |
| Laufflächentemp. HL mitte | Laufflächentemperatur hinten links – mitte (°C) |
| Laufflächentemp. HL innen | Laufflächentemperatur hinten links – innen (°C) |
| Laufflächentemp. HR außen | Laufflächentemperatur hinten rechts – außen (°C) |
| Laufflächentemp. HR mitte | Laufflächentemperatur hinten rechts – mitte (°C) |
| Laufflächentemp. HR innen | Laufflächentemperatur hinten rechts – innen (°C) |
| RDK-Temp VL | RDK-Temperatur vorne links (°C) |
| RDK-Temp VR | RDK-Temperatur vorne rechts (°C) |
| RDK-Temp HL | RDK-Temperatur hinten links (°C) |
| RDK-Temp HR | RDK-Temperatur hinten rechts (°C) |
| Luft Temp Kaltdruck | Lufttemperatur bei Kaltdruckmessung (°C) |
| Track Temp Kaltdruck | Streckentemperatur bei Kaltdruckmessung (°C) |
| Luft Temp Warmdruck | Lufttemperatur bei Warmdruckmessung (°C) |
| Track Temp Warmdruck | Streckentemperatur bei Warmdruckmessung (°C) |
| Zeit Kaltdruck | Uhrzeit der Kaltdruckmessung |
| Zeit Warmdruck | Uhrzeit der Warmdruckmessung |
| Fahrer | Name des Fahrers |
| Fahrzeug | Fahrzeugbezeichnung |
| Startnummer | Startnummer des Fahrzeugs |
| Strecke | Name der Rennstrecke |
| Länge | Streckenlänge (km) – optional |
| Rundenanzahl | Anzahl gefahrener Runden |
| Laufzeit in km | Gefahrene Distanz (km) |
| Datum | Datum der Session |
| Veranstaltung / Session | Bezeichnung der Veranstaltung bzw. Session |

---

## 2. Laufzeiten Übersicht Reifen

Übersicht der kumulierten Laufleistung pro Einzelreifen.

| Feld | Beschreibung |
|------|-------------|
| Marke | Reifenhersteller |
| Bezeichnung | Reifenbezeichnung / -typ |
| Bar-Code Reifen | Eindeutiger Barcode des Reifens |
| Position | Einbauposition (VL / VR / HL / HR) |
| Satz Nr. | Zugehörige Satznummer |
| Laufzeit in km | Kumulierte Laufleistung (km) |

---

## 3. Laufzeiten Übersicht Felgen

Übersicht der kumulierten Laufleistung pro Felge.

| Feld | Beschreibung |
|------|-------------|
| Felgen Nr. | Eindeutige Felgennummer (Format: Set # Felgennummer) |
| Laufzeit in km | Kumulierte Laufleistung (km) |
| Position | Einbauposition (VL / VR / HL / HR) |
| Bemerkung | Freitextfeld für Anmerkungen |

---

## Positionslegende

| Kürzel | Bedeutung |
|--------|-----------|
| VL | Vorne Links |
| VR | Vorne Rechts |
| HL | Hinten Links |
| HR | Hinten Rechts |
| VA | Vorderachse |
| HA | Hinterachse |
