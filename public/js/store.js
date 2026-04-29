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
    if (fresh?.items?.length) {
      data = migrateData(fresh);
      _cache();
    }
  } catch (e) {
    console.warn('[Seoul Meet] Using cache:', e.message);
  }
}

/**
 * Миграция старых данных — добавляет недостающие поля
 * не трогая существующие цены, фото, блюда.
 */
function migrateData(loaded) {
  const d = deepClone(loaded);

  // ── Категории: добавить type, name_en, nameShort_en, desc_en если нет ──
  const catDefaults = {};
  DEFAULT_DATA.categories.forEach(c => { catDefaults[c.id] = c; });

  d.categories = d.categories.map(c => {
    const def = catDefaults[c.id] || {};
    return {
      type:         c.type         || def.type         || 'food',
      nameShort_en: c.nameShort_en || def.nameShort_en || c.nameShort || '',
      name_en:      c.name_en      || def.name_en      || c.name      || '',
      desc_en:      c.desc_en      || def.desc_en      || '',
      ...c  // исходные поля идут поверх — не затираем реальные данные
    };
    // Но type/nameShort_en/name_en/desc_en нужно ставить если их нет:
  }).map(c => {
    const def = catDefaults[c.id] || {};
    if (!loaded.categories.find(x => x.id === c.id)?.type)
      c.type = def.type || 'food';
    if (!loaded.categories.find(x => x.id === c.id)?.nameShort_en)
      c.nameShort_en = def.nameShort_en || c.nameShort || '';
    if (!loaded.categories.find(x => x.id === c.id)?.name_en)
      c.name_en = def.name_en || c.name || '';
    if (!loaded.categories.find(x => x.id === c.id)?.desc_en)
      c.desc_en = def.desc_en || '';
    return c;
  });

  // ── Блюда: добавить name_en, desc_en, sub_en если нет ──
  const itemDefaults = {};
  DEFAULT_DATA.items.forEach(it => { itemDefaults[it.id] = it; });

  d.items = d.items.map(it => {
    const def = itemDefaults[it.id] || {};
    const orig = loaded.items.find(x => x.id === it.id) || {};
    if (!orig.name_en)  it.name_en  = def.name_en  || it.name  || '';
    if (!orig.desc_en)  it.desc_en  = def.desc_en  || it.desc  || '';
    if (!orig.sub_en)   it.sub_en   = def.sub_en   || it.sub   || '';

    // Миграция модификаторов: добавить name_en к опциям
    if (Array.isArray(it.mods)) {
      it.mods = it.mods.map((mg, gi) => {
        const defMg = def.mods?.[gi] || {};
        if (!mg.name_en) mg.name_en = defMg.name_en || mg.name || '';
        if (Array.isArray(mg.options)) {
          mg.options = mg.options.map((opt, oi) => {
            const defOpt = defMg.options?.[oi] || {};
            if (!opt.name_en) opt.name_en = defOpt.name_en || opt.name || '';
            return opt;
          });
        }
        return mg;
      });
    }
    return it;
  });

  // ── Settings: добавить новые поля если нет ──
  if (!d.settings.complimentText_en)
    d.settings.complimentText_en = DEFAULT_DATA.settings.complimentText_en || '';
  if (!d.settings.allergenText_en)
    d.settings.allergenText_en = DEFAULT_DATA.settings.allergenText_en || '';
  if (!d.settings.workingHours)
    d.settings.workingHours = '12:00 – 00:00';
  if (!d.settings.workingHours_en)
    d.settings.workingHours_en = '12:00 – 00:00';

  return d;
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
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'X-Admin-Password': pw },
    body: fd
  });
  const json = await res.json();
  if (!res.ok || !json.ok) throw new Error(json.error || `HTTP ${res.status}`);
  return json.url;
}

async function deleteImageFromServer(url) {
  if (!url?.startsWith('/uploads/')) return;
  const pw = data.settings?.adminPassword || 'SM2025';
  const fn = url.split('/').pop();
  await fetch(`/api/upload/${fn}`, {
    method: 'DELETE',
    headers: { 'X-Admin-Password': pw }
  }).catch(() => {});
}

async function resetData() {
  if (!confirm('Сбросить всё меню к исходным данным? Нельзя отменить.')) return;
  data = deepClone(DEFAULT_DATA);
  await saveData();
  renderAdmin();
  toast('Данные сброшены ✓');
}

function _cache() {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (e) {}
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
