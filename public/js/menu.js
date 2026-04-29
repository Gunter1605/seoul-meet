/**
 * Seoul Meet — Guest Menu Rendering
 * Навигация по категориям, рендер блюд, открытие карточки.
 */

'use strict';

/* ── Баннер ── */
function renderCompliment() {
  document.getElementById('complimentBanner').textContent = data.settings.complimentText || '';
}

/* ── Навигация ── */
function renderNav() {
  const nav = document.getElementById('catNav');
  nav.innerHTML = sortedCats().map((c, i) => `
    <button class="nav-btn${i === 0 ? ' active' : ''}"
            id="navBtn_${c.id}"
            onclick="showSection('${c.id}')">
      ${c.nameShort}
    </button>`
  ).join('');
}

function showSection(catId) {
  currentCat = catId;
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('navBtn_' + catId);
  if (btn) {
    btn.classList.add('active');
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
  renderSection(catId);
  window.scrollTo({ top: 0 });
  document.getElementById('btnMenu').classList.add('active');
}

function goMenu() {
  document.querySelectorAll('.bottom-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('btnMenu').classList.add('active');
}

/* ── Секция ── */
function renderSection(catId) {
  const cat = data.categories.find(c => c.id === catId);
  if (!cat) { document.getElementById('menuContent').innerHTML = ''; return; }

  const items = data.items.filter(it => it.cat === catId);
  const subs  = [...new Set(items.map(it => it.sub).filter(Boolean))];

  let html = `
    <div class="section active">
      <div class="section-header">
        <div class="section-title">${formatCatTitle(cat.name)}</div>
        ${cat.desc ? `<div class="section-desc">${cat.desc}</div>` : ''}
      </div>`;

  if (subs.length > 0) {
    subs.forEach(sub => {
      html += `<div class="subsection-label">${sub}</div>`;
      items.filter(it => it.sub === sub).forEach(it => { html += renderItemRow(it); });
    });
    items.filter(it => !it.sub).forEach(it => { html += renderItemRow(it); });
  } else {
    items.forEach(it => { html += renderItemRow(it); });
  }

  if (catId === 'bbq')
    html += `<div class="note-box"><p>Все блюда BBQ подаются с набором корейских закусок <em>панчан</em> и соусами для макания.</p><span class="service-charge">Обслуживание +10%</span></div>`;
  if (catId === 'kids')
    html += `<div class="note-box"><p>⚠️ Если у вас имеется аллергия на определённые продукты, пожалуйста, предупредите официанта.</p><p>К каждому заказу в качестве комплимента подаются безлимитные корейские салаты.</p><span class="service-charge">Обслуживание +10%</span></div>`;

  html += '</div>';
  document.getElementById('menuContent').innerHTML = html;
}

/* ── Одно блюдо в списке ── */
function renderItemRow(it) {
  const imgHtml = it.img
    ? `<img src="${it.img}" alt="${esc(it.name)}" loading="lazy">`
    : `<div class="item-img-placeholder">${catSvg(it.cat)}</div>`;

  const badges = (it.badges || []).map(b => {
    if (b === 'new')   return `<span class="badge-new">new</span>`;
    if (b === 'spicy') return `<span class="badge-spicy">🌶</span>`;
    if (b === 'pork')  return `<span class="badge-pork">свинина</span>`;
    return '';
  }).join('');

  const hasMods = (it.mods || []).length > 0;

  return `
    <div class="menu-item${it.isPrime ? ' item-prime' : ''}"
         onclick="openItemModal('${it.id}')">
      <div class="item-img-wrap">${imgHtml}</div>
      <div class="item-body">
        <div class="item-name">${esc(it.name)} ${badges}</div>
        ${it.desc ? `<div class="item-desc">${esc(it.desc)}</div>` : ''}
        <div class="item-footer">
          ${it.weight ? `<span class="item-weight">${esc(it.weight)}</span>` : ''}
          ${hasMods ? `<span style="font-size:10px;color:var(--text-muted);opacity:.7">выбор ›</span>` : ''}
          <span class="item-price">${fmt(it.price)} ₸</span>
        </div>
      </div>
    </div>`;
}
