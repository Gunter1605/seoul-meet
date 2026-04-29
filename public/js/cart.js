/**
 * Seoul Meet — Cart State
 * Управление состоянием корзины/заказа.
 */

'use strict';

let cart = [];

function updateCartBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cartBadge');
  badge.textContent = total;
  badge.classList.toggle('show', total > 0);
}
