/**
 * Seoul Meet — Data Store
 * Данные хранятся на сервере в data/menu.json.
 * Синхронизация автоматическая — все устройства читают одно и то же.
 */

'use strict';

const CACHE_KEY = 'seoulMeetCache'; // localStorage только как кэш для быстрого старта

let data = {};

/* ══════════════════════════════════════════
   ЗАГРУЗКА
══════════════════════════════════════════ */

async function loadData() {
  // 1. Показываем кэш мгновенно (UX)
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    data = cached ? JSON.parse(cached) : deepClone(DEFAULT_DATA);
  } catch (e) {
    data = deepClone(DEFAULT_DATA);
  }

  // 2. Загружаем актуальные данные с сервера
  try {
    const res = await fetch('/api/menu');

    if (res.status === 204) {
      // Сервер работает, но menu.json ещё не создан — используем DEFAULT_DATA
      data = deepClone(DEFAULT_DATA);
      _updateCache();
      return;
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const fresh = await res.json();
    if (fresh && Array.isArray(fresh.items)) {
      data = fresh;
      _updateCache();
    }
  } catch (e) {
    console.warn('[Seoul Meet] Сервер недоступен, используется кэш:', e.message);
    // Продолжаем работу с кэшем
  }
}

/* ══════════════════════════════════════════
   СОХРАНЕНИЕ
══════════════════════════════════════════ */

/**
 * Сохраняет данные на сервер.
 * Пароль берётся из data.settings.adminPassword.
 */
async function saveData() {
  _updateCache(); // сначала локально

  const password = data.settings?.adminPassword || 'SM2025';

  const res = await fetch('/api/menu', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Password': password
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
}

/* ══════════════════════════════════════════
   ЗАГРУЗКА ФОТО
══════════════════════════════════════════ */

/**
 * Загружает файл изображения на сервер.
 * @param {File} file
 * @returns {Promise<string>} URL — например /uploads/1234567890-abc.jpg
 */
async function uploadImageToServer(file) {
  const password = data.settings?.adminPassword || 'SM2025';

  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'X-Admin-Password': password },
    body: formData
  });

  const json = await res.json();
  if (!res.ok || !json.ok) throw new Error(json.error || `HTTP ${res.status}`);
  return json.url;
}

/**
 * Удаляет файл фото с сервера (при удалении блюда).
 * @param {string} url — /uploads/filename.jpg
 */
async function deleteImageFromServer(url) {
  if (!url || !url.startsWith('/uploads/')) return;
  const filename = url.split('/').pop();
  const password = data.settings?.adminPassword || 'SM2025';
  await fetch(`/api/upload/${filename}`, {
    method: 'DELETE',
    headers: { 'X-Admin-Password': password }
  }).catch(() => {}); // не критично если не удалось
}

/* ══════════════════════════════════════════
   СБРОС
══════════════════════════════════════════ */

async function resetData() {
  if (!confirm('Сбросить всё меню к исходным данным? Нельзя отменить.')) return;
  data = deepClone(DEFAULT_DATA);
  try {
    await saveData();
    renderAdmin();
    toast('Данные сброшены к исходным ✓');
  } catch (e) {
    toast('Ошибка сброса: ' + e.message);
  }
}

/* ══════════════════════════════════════════
   УТИЛИТЫ
══════════════════════════════════════════ */

function _updateCache() {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (e) {}
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
