/**
 * Datenbank-Modul für die Reifendatenbank.
 * Verwendet better-sqlite3 – synchron, schnell, perfekt für Raspberry Pi.
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'tire_database.db');

let db;

function getDb() {
    if (!db) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
    }
    return db;
}

function initDb() {
    const conn = getDb();

    conn.exec(`
    CREATE TABLE IF NOT EXISTS reifendruck (
        id                      INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at              TEXT DEFAULT (datetime('now','localtime')),
        updated_at              TEXT DEFAULT (datetime('now','localtime')),

        -- Session-Info
        datum                   TEXT,
        veranstaltung           TEXT,
        strecken_variante       TEXT,
        strecken_laenge         REAL,
        session_typ             TEXT,
        stint_nr                INTEGER,
        fahrer                  TEXT,
        fahrzeug                TEXT,
        startnummer             TEXT,

        -- Reifen-Info
        set_nr                  TEXT,
        felgen_nr               TEXT,
        marke                   TEXT,
        reifen_typ              TEXT,

        -- Kaltdruck
        kaltdruck_vl            REAL,
        kaltdruck_vr            REAL,
        kaltdruck_hl            REAL,
        kaltdruck_hr            REAL,
        luft_temp_kalt          REAL,
        track_temp_kalt         REAL,
        zeit_kaltdruck          TEXT,

        -- Kalt-Laufflächentemperaturen
        lft_kalt_vl_aussen      REAL,
        lft_kalt_vl_mitte       REAL,
        lft_kalt_vl_innen       REAL,
        lft_kalt_vr_aussen      REAL,
        lft_kalt_vr_mitte       REAL,
        lft_kalt_vr_innen       REAL,
        lft_kalt_hl_aussen      REAL,
        lft_kalt_hl_mitte       REAL,
        lft_kalt_hl_innen       REAL,
        lft_kalt_hr_aussen      REAL,
        lft_kalt_hr_mitte       REAL,
        lft_kalt_hr_innen       REAL,

        -- Warmdruck
        warmdruck_vl            REAL,
        warmdruck_vr            REAL,
        warmdruck_hl            REAL,
        warmdruck_hr            REAL,
        luft_temp_warm          REAL,
        track_temp_warm         REAL,
        zeit_warmdruck          TEXT,

        -- Warm-Laufflächentemperaturen
        lft_warm_vl_aussen      REAL,
        lft_warm_vl_mitte       REAL,
        lft_warm_vl_innen       REAL,
        lft_warm_vr_aussen      REAL,
        lft_warm_vr_mitte       REAL,
        lft_warm_vr_innen       REAL,
        lft_warm_hl_aussen      REAL,
        lft_warm_hl_mitte       REAL,
        lft_warm_hl_innen       REAL,
        lft_warm_hr_aussen      REAL,
        lft_warm_hr_mitte       REAL,
        lft_warm_hr_innen       REAL,

        -- RDK-Druck
        rdk_druck_vl            REAL,
        rdk_druck_vr            REAL,
        rdk_druck_hl            REAL,
        rdk_druck_hr            REAL,

        -- RDK-Temperaturen
        rdk_temp_vl             REAL,
        rdk_temp_vr             REAL,
        rdk_temp_hl             REAL,
        rdk_temp_hr             REAL,

        -- Laufleistung
        rundenanzahl            INTEGER,
        laufzeit_km             REAL
    );

    CREATE TABLE IF NOT EXISTS felgen (
        id                      INTEGER PRIMARY KEY AUTOINCREMENT,
        felgen_nr               TEXT UNIQUE NOT NULL,
        bemerkung               TEXT,
        erstellt_am             TEXT DEFAULT (datetime('now','localtime'))
    );
    `);
}

// ── Alle Felder ──
const FIELDS = [
    'datum', 'veranstaltung', 'strecken_variante', 'strecken_laenge', 'session_typ', 'stint_nr',
    'fahrer', 'fahrzeug', 'startnummer',
    'set_nr', 'felgen_nr', 'marke', 'reifen_typ',
    'kaltdruck_vl', 'kaltdruck_vr', 'kaltdruck_hl', 'kaltdruck_hr',
    'luft_temp_kalt', 'track_temp_kalt', 'zeit_kaltdruck',
    'lft_kalt_vl_aussen', 'lft_kalt_vl_mitte', 'lft_kalt_vl_innen',
    'lft_kalt_vr_aussen', 'lft_kalt_vr_mitte', 'lft_kalt_vr_innen',
    'lft_kalt_hl_aussen', 'lft_kalt_hl_mitte', 'lft_kalt_hl_innen',
    'lft_kalt_hr_aussen', 'lft_kalt_hr_mitte', 'lft_kalt_hr_innen',
    'warmdruck_vl', 'warmdruck_vr', 'warmdruck_hl', 'warmdruck_hr',
    'luft_temp_warm', 'track_temp_warm', 'zeit_warmdruck',
    'lft_warm_vl_aussen', 'lft_warm_vl_mitte', 'lft_warm_vl_innen',
    'lft_warm_vr_aussen', 'lft_warm_vr_mitte', 'lft_warm_vr_innen',
    'lft_warm_hl_aussen', 'lft_warm_hl_mitte', 'lft_warm_hl_innen',
    'lft_warm_hr_aussen', 'lft_warm_hr_mitte', 'lft_warm_hr_innen',
    'rdk_druck_vl', 'rdk_druck_vr', 'rdk_druck_hl', 'rdk_druck_hr',
    'rdk_temp_vl', 'rdk_temp_vr', 'rdk_temp_hl', 'rdk_temp_hr',
    'rundenanzahl', 'laufzeit_km'
];

function cleanValue(val) {
    if (val === '' || val === undefined || val === null) return null;
    return val;
}

function saveReifendruck(data, entryId = null) {
    const conn = getDb();
    const values = {};
    for (const f of FIELDS) {
        values[f] = cleanValue(data[f]);
    }

    if (entryId) {
        const setClause = FIELDS.map(f => `${f} = @${f}`).join(', ');
        const sql = `UPDATE reifendruck SET ${setClause}, updated_at = datetime('now','localtime') WHERE id = @id`;
        conn.prepare(sql).run({ ...values, id: entryId });
    } else {
        const fieldNames = FIELDS.join(', ');
        const placeholders = FIELDS.map(f => `@${f}`).join(', ');
        const sql = `INSERT INTO reifendruck (${fieldNames}) VALUES (${placeholders})`;
        const result = conn.prepare(sql).run(values);
        entryId = result.lastInsertRowid;
    }

    // Auto-Track Felgen
    if (values.felgen_nr) {
        conn.prepare('INSERT OR IGNORE INTO felgen (felgen_nr) VALUES (?)').run(values.felgen_nr);
    }

    return entryId;
}

function getReifendruckList() {
    return getDb().prepare(
        'SELECT * FROM reifendruck ORDER BY datum DESC, created_at DESC'
    ).all();
}

function getReifendruckById(id) {
    return getDb().prepare('SELECT * FROM reifendruck WHERE id = ?').get(id);
}

function deleteReifendruck(id) {
    getDb().prepare('DELETE FROM reifendruck WHERE id = ?').run(id);
}

function getLaufzeitenReifen() {
    return getDb().prepare(`
        SELECT
            veranstaltung,
            set_nr,
            marke,
            reifen_typ,
            GROUP_CONCAT(DISTINCT fahrer) as fahrer,
            COUNT(*) as einsaetze,
            ROUND(COALESCE(SUM(laufzeit_km), 0), 1) as gesamt_km,
            COALESCE(SUM(rundenanzahl), 0) as gesamt_runden
        FROM reifendruck
        WHERE set_nr IS NOT NULL
        GROUP BY veranstaltung, set_nr
        ORDER BY veranstaltung, CAST(set_nr AS INTEGER)
    `).all();
}

function getLaufzeitenFelgen() {
    return getDb().prepare(`
        SELECT
            f.felgen_nr,
            f.bemerkung,
            ROUND(COALESCE(SUM(rd.laufzeit_km), 0), 1) as gesamt_km,
            COUNT(rd.id) as einsaetze
        FROM felgen f
        LEFT JOIN reifendruck rd ON f.felgen_nr = rd.felgen_nr
        GROUP BY f.felgen_nr
        ORDER BY f.felgen_nr
    `).all();
}

function updateFelgeBemerkung(felgenNr, bemerkung) {
    getDb().prepare('UPDATE felgen SET bemerkung = ? WHERE felgen_nr = ?').run(bemerkung, felgenNr);
}

function getAllFelgen() {
    return getDb().prepare('SELECT felgen_nr, bemerkung FROM felgen ORDER BY felgen_nr').all();
}

function addFelge(felgenNr, bemerkung) {
    getDb().prepare('INSERT OR IGNORE INTO felgen (felgen_nr, bemerkung) VALUES (?, ?)').run(felgenNr, bemerkung || '');
}

function getDashboardStats() {
    const conn = getDb();
    const stats = {};

    stats.anzahl_eintraege = conn.prepare('SELECT COUNT(*) as c FROM reifendruck').get().c;
    stats.anzahl_felgen = conn.prepare('SELECT COUNT(*) as c FROM felgen').get().c;
    stats.anzahl_sets = conn.prepare(
        'SELECT COUNT(DISTINCT set_nr) as c FROM reifendruck WHERE set_nr IS NOT NULL'
    ).get().c;
    stats.anzahl_sessions = conn.prepare(
        'SELECT COUNT(DISTINCT session_typ) as c FROM reifendruck WHERE session_typ IS NOT NULL'
    ).get().c;
    stats.gesamt_km = conn.prepare(
        'SELECT ROUND(COALESCE(SUM(laufzeit_km), 0), 1) as c FROM reifendruck'
    ).get().c;
    stats.gesamt_runden = conn.prepare(
        'SELECT COALESCE(SUM(rundenanzahl), 0) as c FROM reifendruck'
    ).get().c;

    stats.letzte_eintraege = conn.prepare(
        'SELECT id, datum, veranstaltung, strecken_variante, session_typ, set_nr, fahrer FROM reifendruck ORDER BY created_at DESC LIMIT 5'
    ).all();

    // DB-Größe
    try {
        const dbStat = fs.statSync(DB_PATH);
        const size = dbStat.size;
        stats.db_groesse = size > 1024 * 1024
            ? `${(size / (1024 * 1024)).toFixed(1)} MB`
            : `${(size / 1024).toFixed(1)} KB`;
    } catch {
        stats.db_groesse = '0 KB';
    }

    return stats;
}

function exportReifendruckCsv() {
    const conn = getDb();
    const rows = conn.prepare('SELECT * FROM reifendruck ORDER BY datum DESC').all();
    if (rows.length === 0) return 'Keine Daten';

    const columns = Object.keys(rows[0]);
    const lines = [columns.join(';')];
    for (const row of rows) {
        lines.push(columns.map(c => {
            const v = row[c];
            return v === null || v === undefined ? '' : String(v);
        }).join(';'));
    }
    return lines.join('\n');
}

module.exports = {
    initDb,
    saveReifendruck,
    getReifendruckList,
    getReifendruckById,
    deleteReifendruck,
    getLaufzeitenReifen,
    getLaufzeitenFelgen,
    updateFelgeBemerkung,
    getAllFelgen,
    addFelge,
    getDashboardStats,
    exportReifendruckCsv
};
