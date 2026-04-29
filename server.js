/**
 * Seoul Meet — Backend Server
 *
 * Запуск:  node server.js
 * Порт:    3000 (или PORT из переменной окружения)
 *
 * Один Volume на /app/storage хранит и меню и фотографии:
 *   /app/storage/menu.json
 *   /app/storage/uploads/
 */

'use strict';

const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Пути ── */
const PUBLIC_DIR  = path.join(__dirname, 'public');
const STORAGE_DIR = path.join(__dirname, 'storage');   // ← Volume монтируется сюда
const DATA_FILE   = path.join(STORAGE_DIR, 'menu.json');
const UPLOADS_DIR = path.join(STORAGE_DIR, 'uploads');

/* ── Создаём папки если нет ── */
if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

/* ── Multer ── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename:    (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase() || '.jpg';
    const name = Date.now() + '-' + Math.random().toString(36).slice(2) + ext;
    cb(null, name);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ok = allowed.includes(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error('Только изображения'), ok);
  }
});

/* ── Helpers ── */
function readMenu() {
  try   { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return null; }
}

function writeMenu(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function checkAdminAuth(req, res) {
  const menu     = readMenu();
  const expected = menu?.settings?.adminPassword || 'SM2025';
  const given    = req.headers['x-admin-password'] || '';
  if (given !== expected) {
    res.status(401).json({ error: 'Неверный пароль' });
    return false;
  }
  return true;
}

/* ── Middleware ── */
app.use(express.json({ limit: '20mb' }));
app.use(express.static(PUBLIC_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));

/* ── API ── */
app.get('/api/menu', (req, res) => {
  const menu = readMenu();
  if (!menu) return res.status(204).end();
  res.json(menu);
});

app.put('/api/menu', (req, res) => {
  if (!checkAdminAuth(req, res)) return;
  const payload = req.body;
  if (!payload || !Array.isArray(payload.items))
    return res.status(400).json({ error: 'Неверный формат данных' });
  try   { writeMenu(payload); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/upload', (req, res) => {
  if (!checkAdminAuth(req, res)) return;
  upload.single('image')(req, res, (err) => {
    if (err)       return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'Файл не получен' });
    res.json({ ok: true, url: `/uploads/${req.file.filename}` });
  });
});

app.delete('/api/upload/:filename', (req, res) => {
  if (!checkAdminAuth(req, res)) return;
  const filename = path.basename(req.params.filename);
  const filepath = path.join(UPLOADS_DIR, filename);
  if (fs.existsSync(filepath)) {
    try { fs.unlinkSync(filepath); } catch (e) {}
  }
  res.json({ ok: true });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

/* ── Start ── */
app.listen(PORT, () => {
  console.log(`\n✅ Seoul Meet запущен: http://localhost:${PORT}`);
  console.log(`   Admin Panel:         http://localhost:${PORT}/#admin-seoulm33t`);
  console.log(`   Пароль по умолчанию: SM2025\n`);
});
