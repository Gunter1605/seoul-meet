'use strict';

function renderCompliment() {
  const txt = t(data.settings.complimentText, data.settings.complimentText_en);
  document.getElementById('complimentBanner').textContent = txt || '';
}

function renderHoursInHero() {
  const el = document.getElementById('heroHours');
  if (el) el.textContent = data.settings.workingHours || '12:00 – 00:00';
}

/* ── Nav ── */
function renderNav() {
  const cats = sortedCats();
  const foodCats = cats.filter(c => c.type === 'food');
  const barCats  = cats.filter(c => c.type === 'bar' || c.type === 'desserts');

  let html = foodCats.map(c => navBtn(c)).join('');

  if (barCats.length > 0) {
    html += `<div class="nav-divider"></div>`;
    html += barCats.map(c => navBtn(c)).join('');
  }

  document.getElementById('catNav').innerHTML = html;

  // activate first food cat
  const firstId = cats[0]?.id;
  if (firstId) activateNavBtn(firstId);
}

function navBtn(c) {
  const label = t(c.nameShort, c.nameShort_en);
  const isBar = c.type === 'bar';
  return `<button class="nav-btn${isBar ? ' nav-btn-bar' : ''}"
                  id="navBtn_${c.id}"
                  onclick="showSection('${c.id}')">${esc(label)}</button>`;
}

function activateNavBtn(catId) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('navBtn_' + catId);
  if (btn) {
    btn.classList.add('active');
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

function showSection(catId) {
  currentCat = catId;
  activateNavBtn(catId);
  renderSection(catId);
  window.scrollTo({ top: 0 });
  document.getElementById('btnMenu').classList.add('active');
}

function goMenu() {
  document.querySelectorAll('.bottom-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('btnMenu').classList.add('active');
}

/* ── Section ── */
function renderSection(catId) {
  const cat = data.categories.find(c => c.id === catId);
  if (!cat) { document.getElementById('menuContent').innerHTML = ''; return; }

  const type  = cat.type || 'food';
  const items = data.items.filter(it => it.cat === catId);
  const subs  = [...new Set(items.map(it => t(it.sub, it.sub_en)).filter(Boolean))];

  const catName = t(cat.name, cat.name_en);
  const catDesc = t(cat.desc, cat.desc_en);

  let html = `<div class="section active">
    <div class="section-header">
      <div class="section-title">${formatCatTitle(catName)}</div>
      ${catDesc ? `<div class="section-desc">${esc(catDesc)}</div>` : ''}
    </div>`;

  if (type === 'bar') {
    // Барное меню — типографский список без фото
    if (subs.length > 0) {
      subs.forEach(sub => {
        const subItems = items.filter(it => t(it.sub, it.sub_en) === sub);
        html += `<div class="bar-subsection-label">${esc(sub)}</div>`;
        html += subItems.map(renderBarItem).join('');
      });
      items.filter(it => !t(it.sub, it.sub_en)).forEach(it => { html += renderBarItem(it); });
    } else {
      items.forEach(it => { html += renderBarItem(it); });
    }
  } else {
    // Еда / Десерты — стандартные карточки
    if (subs.length > 0) {
      subs.forEach(sub => {
        html += `<div class="subsection-label">${esc(sub)}</div>`;
        items.filter(it => t(it.sub, it.sub_en) === sub).forEach(it => { html += renderItemRow(it, type); });
      });
      items.filter(it => !t(it.sub, it.sub_en)).forEach(it => { html += renderItemRow(it, type); });
    } else {
      items.forEach(it => { html += renderItemRow(it, type); });
    }
  }

  if (catId === 'bbq')
    html += `<div class="note-box"><p>${t('Все блюда BBQ подаются с набором корейских закусок панчан и соусами для макания.','All BBQ dishes are served with Korean side dishes (panchan) and dipping sauces.')}</p><span class="service-charge">${t('Обслуживание +10%','Service charge +10%')}</span></div>`;
  if (catId === 'kids')
    html += `<div class="note-box"><p>⚠️ ${t('Если у вас имеется аллергия, предупредите официанта.','Please inform your waiter of any allergies.')}</p><span class="service-charge">${t('Обслуживание +10%','Service charge +10%')}</span></div>`;

  html += '</div>';
  document.getElementById('menuContent').innerHTML = html;
}

/* ── Стандартная карточка (еда / десерты) ── */
function renderItemRow(it, type) {
  const name = t(it.name, it.name_en);
  const desc = t(it.desc, it.desc_en);
  const showImg = type !== 'bar'; // у десертов фото есть

  const imgHtml = showImg
    ? `<div class="item-img-wrap">${it.img
        ? `<img src="${it.img}" alt="${esc(name)}" loading="lazy">`
        : `<div class="item-img-placeholder">${catSvg(it.cat)}</div>`
      }</div>`
    : '';

  const badges = (it.badges || []).map(b => {
    if (b === 'new')   return `<span class="badge-new">new</span>`;
    if (b === 'spicy') return `<span class="badge-spicy">🌶</span>`;
    if (b === 'pork')  return `<span class="badge-pork">${t('свинина','pork')}</span>`;
    return '';
  }).join('');

  const hasMods = (it.mods || []).length > 0;

  return `
    <div class="menu-item${it.isPrime ? ' item-prime' : ''}" onclick="openItemModal('${it.id}')">
      ${imgHtml}
      <div class="item-body">
        <div class="item-name">${esc(name)} ${badges}</div>
        ${desc ? `<div class="item-desc">${esc(desc)}</div>` : ''}
        <div class="item-footer">
          ${it.weight ? `<span class="item-weight">${esc(it.weight)}</span>` : ''}
          ${hasMods ? `<span class="item-choice-hint">${t('выбор ›','options ›')}</span>` : ''}
          <span class="item-price">${fmt(it.price)} ₸</span>
        </div>
      </div>
    </div>`;
}

/* ── Барная строка (без фото) ── */
function renderBarItem(it) {
  const name = t(it.name, it.name_en);
  const desc = t(it.desc, it.desc_en);
  const hasMods = (it.mods || []).length > 0;
  return `
    <div class="bar-item" onclick="openItemModal('${it.id}')">
      <div class="bar-item-left">
        <span class="bar-item-name">${esc(name)}</span>
        ${desc ? `<span class="bar-item-desc">${esc(desc)}</span>` : ''}
        ${it.weight ? `<span class="bar-item-weight">${esc(it.weight)}</span>` : ''}
      </div>
      <span class="bar-item-price">${fmt(it.price)} ₸${hasMods ? '<span class="bar-choice"> ›</span>' : ''}</span>
    </div>`;
}
