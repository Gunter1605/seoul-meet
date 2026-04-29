/**
 * Seoul Meet — Backend Server
 *
 * Запуск:  node server.js
 * Порт:    3000 (или PORT из переменной окружения)
 *
 * API:
 *   GET  /api/menu          — получить всё меню (публично)
 *   PUT  /api/menu          — обновить меню (требует X-Admin-Password)
 *   POST /api/upload        — загрузить фото (требует X-Admin-Password)
 */

'use strict';

const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── Пути ── */
const DATA_FILE    = path.join(__dirname, 'data', 'menu.json');
const UPLOADS_DIR  = path.join(__dirname, 'uploads');
const PUBLIC_DIR   = path.join(__dirname, 'public');

/* ── Убеждаемся что папки существуют ── */
if (!fs.existsSync(path.join(__dirname, 'data'))) fs.mkdirSync(path.join(__dirname, 'data'));
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

/* ── Multer: сохранение загружаемых фото ── */
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg','.jpeg','.png','.webp','.gif'];
    const ok = allowed.includes(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error('Только изображения'), ok);
  }
});

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */

/** Читает menu.json. Если файла нет — возвращает null. */
function readMenu() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return null;
  }
}

/** Записывает данные в menu.json. */
function writeMenu(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Проверяет пароль администратора из заголовка X-Admin-Password.
 * Пароль хранится в menu.json → settings.adminPassword.
 * Дефолт: SM2025
 */
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

/* ══════════════════════════════════════════
   MIDDLEWARE
══════════════════════════════════════════ */

app.use(express.json({ limit: '20mb' }));
app.use(express.static(PUBLIC_DIR));         // фронтенд
app.use('/uploads', express.static(UPLOADS_DIR)); // загруженные фото

/* ══════════════════════════════════════════
   API ROUTES
══════════════════════════════════════════ */

/**
 * GET /api/menu
 * Возвращает всё меню. Публичный — без авторизации.
 */
app.get('/api/menu', (req, res) => {
  const menu = readMenu();
  if (!menu) {
    // Файла ещё нет — клиент использует DEFAULT_DATA из data.js
    return res.status(204).end();
  }
  res.json(menu);
});

/**
 * PUT /api/menu
 * Сохраняет меню. Требует заголовок X-Admin-Password.
 */
app.put('/api/menu', (req, res) => {
  if (!checkAdminAuth(req, res)) return;

  const payload = req.body;
  if (!payload || !Array.isArray(payload.items)) {
    return res.status(400).json({ error: 'Неверный формат данных' });
  }

  try {
    writeMenu(payload);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * POST /api/upload
 * Загружает фото и возвращает его URL.
 * Требует заголовок X-Admin-Password.
 */
app.post('/api/upload', (req, res) => {
  if (!checkAdminAuth(req, res)) return;

  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'Файл не получен' });

    const url = `/uploads/${req.file.filename}`;
    res.json({ ok: true, url });
  });
});

/**
 * DELETE /api/upload/:filename
 * Удаляет загруженное фото (вызывается при удалении блюда).
 * Требует заголовок X-Admin-Password.
 */
app.delete('/api/upload/:filename', (req, res) => {
  if (!checkAdminAuth(req, res)) return;

  const filename = path.basename(req.params.filename); // защита от path traversal
  const filepath = path.join(UPLOADS_DIR, filename);

  if (!fs.existsSync(filepath)) return res.json({ ok: true }); // уже нет — ок

  try {
    fs.unlinkSync(filepath);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* ── SPA fallback: все остальные запросы → index.html ── */
app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

/* ══════════════════════════════════════════
   START
══════════════════════════════════════════ */

app.listen(PORT, () => {
  console.log(`\n✅ Seoul Meet запущен: http://localhost:${PORT}`);
  console.log(`   Admin Panel:         http://localhost:${PORT}/#admin-seoulm33t`);
  console.log(`   Пароль по умолчанию: SM2025\n`);
});
