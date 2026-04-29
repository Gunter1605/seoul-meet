'use strict';
const CACHE_KEY = 'seoulMeetCache';
let data = {};

async function loadData() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    data = cached ? JSON.parse(cached) : deepClone(DEFAULT_DATA);
  } catch (e) { data = deepClone(DEFAULT_DATA); }

  try {
    const res = await fetch('/api/menu');
    if (res.status === 204) { data = deepClone(DEFAULT_DATA); _cache(); return; }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const fresh = await res.json();
    if (fresh?.items?.length) { data = fresh; _cache(); }
  } catch (e) {
    console.warn('[Seoul Meet] Using cache:', e.message);
  }
}

async function saveData() {
  _cache();
  const pw  = data.settings?.adminPassword || 'SM2025';
  const res = await fetch('/api/menu', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Password': pw },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
}

async function uploadImageToServer(file) {
  const pw = data.settings?.adminPassword || 'SM2025';
  const fd = new FormData();
  fd.append('image', file);
  const res = await fetch('/api/upload', { method:'POST', headers:{'X-Admin-Password':pw}, body:fd });
  const json = await res.json();
  if (!res.ok || !json.ok) throw new Error(json.error || `HTTP ${res.status}`);
  return json.url;
}

async function deleteImageFromServer(url) {
  if (!url?.startsWith('/uploads/')) return;
  const pw  = data.settings?.adminPassword || 'SM2025';
  const fn  = url.split('/').pop();
  await fetch(`/api/upload/${fn}`, { method:'DELETE', headers:{'X-Admin-Password':pw} }).catch(()=>{});
}

async function resetData() {
  if (!confirm('Сбросить всё меню к исходным данным? Нельзя отменить.')) return;
  data = deepClone(DEFAULT_DATA);
  await saveData();
  renderAdmin();
  toast('Данные сброшены ✓');
}

function _cache() { try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch(e){} }
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }
