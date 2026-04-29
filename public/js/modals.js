/**
 * Seoul Meet — Modals
 * Карточка блюда, корзина/заказ, аллергены.
 */

'use strict';

/* ══════════════════════════════════════════
   ITEM DETAIL MODAL
══════════════════════════════════════════ */

function openItemModal(itemId) {
  selectedItem = data.items.find(it => it.id === itemId);
  if (!selectedItem) return;

  itemMods = {};
  itemQty  = 1;

  /* Предвыбор дефолтных опций */
  (selectedItem.mods || []).forEach(mg => {
    if (!mg.options || !mg.options.length) return;
    if (mg.defaultOption) {
      itemMods[mg.id] = mg.defaultOption;
    } else if (mg.required) {
      itemMods[mg.id] = mg.options[0].id;
    }
  });

  openModal('item');
}

function renderItemModal() {
  const it = selectedItem;
  if (!it) return;

  const totalPrice = calcItemPrice();

  /* Модификаторы */
  let modsHtml = '';
  (it.mods || []).forEach(mg => {
    const badge = mg.required
      ? `<span class="mod-required">обязательно</span>`
      : `<span class="mod-optional">опционально</span>`;

    const opts = (mg.options || []).map(opt => {
      const sel      = itemMods[mg.id] === opt.id ? ' selected' : '';
      const priceTag = opt.priceAdj !== 0
        ? `<span class="mod-option-price">${opt.priceAdj > 0 ? '+' : ''}${fmt(opt.priceAdj)} ₸</span>`
        : '';
      return `<button class="mod-option${sel}"
                      onclick="selectMod('${mg.id}','${opt.id}')">
                ${esc(opt.name)}${priceTag}
              </button>`;
    }).join('');

    modsHtml += `
      <div class="mod-group">
        <div class="mod-group-title">${esc(mg.name)} ${badge}</div>
        <div class="mod-options">${opts}</div>
      </div>`;
  });

  /* Изображение */
  const imgHtml = it.img
    ? `<img class="item-modal-img" src="${it.img}" alt="${esc(it.name)}">`
    : `<div class="item-modal-img-placeholder">🍖</div>`;

  /* Бейджи */
  const badges = (it.badges || []).map(b => {
    if (b === 'new')   return `<span class="badge-new" style="font-size:10px">new</span>`;
    if (b === 'spicy') return `<span class="badge-spicy">🌶</span>`;
    return '';
  }).join(' ');

  document.getElementById('modalBody').innerHTML = `
    ${imgHtml}
    <div class="item-modal-body" style="position:relative">
      <button class="modal-close-btn" onclick="closeModal()">✕</button>
      <div class="item-modal-name">${esc(it.name)} ${badges}</div>
      ${it.desc   ? `<div class="item-modal-desc">${esc(it.desc)}</div>`     : ''}
      ${it.weight ? `<div class="item-modal-weight">${esc(it.weight)}</div>` : ''}
      <div class="item-modal-price" id="modalPrice">${fmt(totalPrice)} ₸</div>
      ${modsHtml}
      <div class="qty-row">
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty(-1)">−</button>
          <div class="qty-num" id="qtyNum">${itemQty}</div>
          <button class="qty-btn" onclick="changeQty(1)">+</button>
        </div>
        <button class="add-btn" onclick="addToCart()">
          Добавить · ${fmt(totalPrice * itemQty)} ₸
        </button>
      </div>
      <div style="height:max(16px,env(safe-area-inset-bottom))"></div>
    </div>`;
}

function selectMod(groupId, optId) {
  itemMods[groupId] = optId;
  renderItemModal();
}

function changeQty(d) {
  itemQty = Math.max(1, itemQty + d);
  document.getElementById('qtyNum').textContent = itemQty;
  const p = calcItemPrice();
  const btn = document.querySelector('.add-btn');
  if (btn) btn.textContent = `Добавить · ${fmt(p * itemQty)} ₸`;
}

function calcItemPrice() {
  if (!selectedItem) return 0;
  let price = selectedItem.price;
  (selectedItem.mods || []).forEach(mg => {
    const sel = mg.options?.find(o => o.id === itemMods[mg.id]);
    if (sel) price += (sel.priceAdj || 0);
  });
  return price;
}

function addToCart() {
  /* Проверка обязательных модификаторов */
  const missing = (selectedItem.mods || []).filter(mg => mg.required && !itemMods[mg.id]);
  if (missing.length) {
    toast('Выберите: ' + missing.map(m => m.name).join(', '));
    return;
  }

  const modLabels = (selectedItem.mods || [])
    .map(mg => mg.options?.find(o => o.id === itemMods[mg.id])?.name)
    .filter(Boolean);

  cart.push({
    uid:    Date.now() + '' + Math.random().toString(36).slice(2),
    itemId: selectedItem.id,
    name:   selectedItem.name,
    price:  calcItemPrice(),
    qty:    itemQty,
    mods:   modLabels
  });

  updateCartBadge();
  closeModal();
  toast('Добавлено в заказ ✓');
}

/* ══════════════════════════════════════════
   CART / ORDER MODAL
══════════════════════════════════════════ */

function renderCartModal() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const itemsHtml = cart.length === 0
    ? `<div class="cart-empty">
         <svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h11v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.46 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
         Заказ пуст
       </div>`
    : cart.map(ci => `
        <div class="cart-item">
          <div style="flex:1">
            <div class="cart-item-name">${esc(ci.name)}</div>
            ${ci.mods.length ? `<div class="cart-item-mods">${ci.mods.map(esc).join(' · ')}</div>` : ''}
            <div class="cart-item-qty">× ${ci.qty}</div>
          </div>
          <div class="cart-item-price">${fmt(ci.price * ci.qty)} ₸</div>
          <button class="cart-item-remove" onclick="removeCartItem('${ci.uid}')">✕</button>
        </div>`).join('');

  document.getElementById('modalBody').innerHTML = `
    <div class="cart-header">
      <div class="cart-title">Ваш заказ</div>
      ${cart.length ? `<button class="cart-clear" onclick="clearCart()">Очистить</button>` : ''}
    </div>
    ${itemsHtml}
    ${cart.length ? `
      <div class="cart-total">
        <span class="cart-total-label">Итого</span>
        <span class="cart-total-val">${fmt(total)} ₸</span>
      </div>
      <div class="cart-note">📋 Покажите этот список официанту, чтобы оформить заказ</div>
      <div style="height:max(16px,env(safe-area-inset-bottom))"></div>
    ` : '<div style="height:20px"></div>'}`;
}

function removeCartItem(uid) {
  cart = cart.filter(ci => ci.uid !== uid);
  updateCartBadge();
  renderCartModal();
}

function clearCart() {
  if (!confirm('Очистить весь заказ?')) return;
  cart = [];
  updateCartBadge();
  renderCartModal();
}

/* ══════════════════════════════════════════
   MODAL OVERLAY
══════════════════════════════════════════ */

function openModal(type) {
  currentModal = type;
  const overlay = document.getElementById('modalOverlay');
  const sheet   = document.getElementById('modalSheet');
  overlay.classList.add('open');

  if (type === 'item') {
    sheet.style.borderTopColor = 'var(--red)';
    renderItemModal();
  } else if (type === 'cart') {
    sheet.style.borderTopColor = 'var(--gold)';
    renderCartModal();
  } else if (type === 'allergen') {
    sheet.style.borderTopColor = 'var(--red)';
    const txt = (data.settings.allergenText || '').replace(/\n/g, '<br>');
    document.getElementById('modalBody').innerHTML = `
      <div class="allergen-body">
        <h3>Аллергия и диеты</h3>
        <p>${txt}</p>
      </div>
      <button class="modal-action-btn" onclick="closeModal()">Понятно</button>`;
  }
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  currentModal = null;
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}
