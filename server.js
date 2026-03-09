/**
 * Track-Datenserver – Reifendatenbank
 * POC Web-Anwendung für Raspberry Pi
 */

const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

// Flash-Messages via simple session store (in-memory, kein extra dep)
const flashMessages = [];
app.use((req, res, next) => {
    res.locals.flash = flashMessages.splice(0);
    res.locals.currentPath = req.path;
    next();
});
function flash(category, message) {
    flashMessages.push({ category, message });
}

// DB initialisieren
db.initDb();

// ── Dashboard ──
app.get('/', (req, res) => {
    const stats = db.getDashboardStats();
    res.render('dashboard', { stats });
});

// ── Reifendruck: Liste ──
app.get('/reifendruck', (req, res) => {
    const entries = db.getReifendruckList();
    res.render('reifendruck/list', { entries });
});

// ── Reifendruck: Neu ──
app.get('/reifendruck/neu', (req, res) => {
    const now = new Date();
    const prefill = {
        datum: now.toISOString().slice(0, 10),
        zeit_kaltdruck: now.toTimeString().slice(0, 5),
        strecken_variante: 'NLS',
        strecken_laenge: 25.378
    };
    const felgen = db.getAllFelgen();
    res.render('reifendruck/form', { entry: prefill, isNew: true, felgen });
});

app.post('/reifendruck/neu', (req, res) => {
    const entryId = db.saveReifendruck(req.body);
    flash('success', `Eintrag #${entryId} erfolgreich gespeichert!`);
    res.redirect(`/reifendruck/${entryId}`);
});

// ── Reifendruck: Detail ──
app.get('/reifendruck/:id', (req, res) => {
    const entry = db.getReifendruckById(req.params.id);
    if (!entry) {
        flash('danger', 'Eintrag nicht gefunden.');
        return res.redirect('/reifendruck');
    }
    res.render('reifendruck/detail', { entry });
});

// ── Reifendruck: Bearbeiten ──
app.get('/reifendruck/:id/bearbeiten', (req, res) => {
    const entry = db.getReifendruckById(req.params.id);
    if (!entry) {
        flash('danger', 'Eintrag nicht gefunden.');
        return res.redirect('/reifendruck');
    }
    const felgen = db.getAllFelgen();
    res.render('reifendruck/form', { entry, isNew: false, felgen });
});

app.post('/reifendruck/:id/bearbeiten', (req, res) => {
    db.saveReifendruck(req.body, req.params.id);
    flash('success', `Eintrag #${req.params.id} aktualisiert!`);
    res.redirect(`/reifendruck/${req.params.id}`);
});

// ── Reifendruck: Löschen ──
app.post('/reifendruck/:id/loeschen', (req, res) => {
    db.deleteReifendruck(req.params.id);
    flash('warning', `Eintrag #${req.params.id} gelöscht.`);
    res.redirect('/reifendruck');
});

// ── Reifendruck: Duplizieren ──
app.get('/reifendruck/:id/duplizieren', (req, res) => {
    const entry = db.getReifendruckById(req.params.id);
    if (!entry) {
        flash('danger', 'Eintrag nicht gefunden.');
        return res.redirect('/reifendruck');
    }
    const copy = { ...entry };
    delete copy.id;
    copy.datum = new Date().toISOString().slice(0, 10);
    const felgen = db.getAllFelgen();
    res.render('reifendruck/form', { entry: copy, isNew: true, felgen });
});

// ── Laufzeiten Reifen ──
app.get('/laufzeiten/reifen', (req, res) => {
    const reifen = db.getLaufzeitenReifen();
    res.render('laufzeiten/reifen', { reifen });
});

// ── Laufzeiten Felgen ──
app.get('/laufzeiten/felgen', (req, res) => {
    const felgen = db.getLaufzeitenFelgen();
    res.render('laufzeiten/felgen', { felgen });
});

app.post('/laufzeiten/felgen', (req, res) => {
    const { felgen_nr, bemerkung, action } = req.body;
    if (action === 'add' && felgen_nr) {
        db.addFelge(felgen_nr, bemerkung || '');
        flash('success', `Felge "${felgen_nr}" hinzugefügt.`);
    } else if (felgen_nr) {
        db.updateFelgeBemerkung(felgen_nr, bemerkung || '');
        flash('success', 'Bemerkung gespeichert.');
    }
    res.redirect('/laufzeiten/felgen');
});

// ── API: Felgen-Liste (JSON für Form-Dropdown) ──
app.get('/api/felgen', (req, res) => {
    res.json(db.getAllFelgen());
});

// ── CSV Export ──
app.get('/export/csv', (req, res) => {
    const csv = db.exportReifendruckCsv();
    const now = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=reifendruck_export_${now}.csv`);
    // BOM for Excel UTF-8 compatibility
    res.send('\ufeff' + csv);
});

// ── Start ──
app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('════════════════════════════════════════════════════════');
    console.log('  🏁  Track-Datenserver – Reifendatenbank');
    console.log(`  📡  Öffne im Browser: http://localhost:${PORT}`);
    console.log('════════════════════════════════════════════════════════');
    console.log('');
});
