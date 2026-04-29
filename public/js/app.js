/**
 * Seoul Meet — App Entry Point
 */

'use strict';

let currentCat   = '';
let currentModal = null;
let selectedItem = null;
let itemMods     = {};
let itemQty      = 1;

async function init() {
  await loadData();

  const isAdmin = location.hash === '#admin-seoulm33t'
               || location.search.includes('admin-panel');

  if (isAdmin) showAdminLogin();
  else         showGuest();
}

function showGuest() {
  document.getElementById('guest-root').style.display       = '';
  document.getElementById('admin-login-root').style.display = 'none';
  document.getElementById('admin-root').style.display       = 'none';
  renderCompliment();
  renderNav();
  const first = sortedCats()[0];
  showSection(first ? first.id : '');
}

function showAdminLogin() {
  document.getElementById('guest-root').style.display       = 'none';
  document.getElementById('admin-root').style.display       = 'none';
  const el = document.getElementById('admin-login-root');
  el.style.display = 'flex';
  el.classList.add('show');
  setTimeout(() => document.getElementById('adminPassInput')?.focus(), 300);
}

function exitAdmin() {
  document.getElementById('admin-login-root').style.display = 'none';
  location.hash = '';
  showGuest();
}

/* ── Утилиты ── */
function fmt(n) { return Number(n || 0).toLocaleString('ru-RU'); }

function esc(s) {
  return String(s || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function toast(msg, duration = 2400) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._tid);
  t._tid = setTimeout(() => t.classList.remove('show'), duration);
}

function sortedCats() {
  return [...data.categories].sort((a, b) => (a.order || 0) - (b.order || 0));
}

function catSvg(cat) {
  const meat   = `<svg viewBox="0 0 24 24"><path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-5.21-6.65-6.82-8.28-6.82C3.27 8.17 1 10.85 1 13.99v1h15.03v-1z"/></svg>`;
  const bowl   = `<svg viewBox="0 0 24 24"><path d="M20 3H4v10c0 3.31 2.69 6 6 6h4c3.31 0 6-2.69 6-6V3zm-2 2v3h-5V5h5zm-7 0v3H6V5h5zM10 19c-2.76 0-5-2.24-5-5v-3h5v3h5v3c0 2.76-2.24 5-5 5zm9 2h-4v-2h4v2z"/></svg>`;
  const noodle = `<svg viewBox="0 0 24 24"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z"/></svg>`;
  const rice   = `<svg viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>`;
  if (['bbq','prime','dishes'].includes(cat)) return meat;
  if (cat === 'soups')                        return bowl;
  if (['noodles','ramen','kimbap'].includes(cat)) return noodle;
  return rice;
}

function formatCatTitle(name) {
  const parts = name.split(' ');
  if (parts.length === 2) return `${parts[0]} <em>${parts[1]}</em>`;
  if (['Appetizers','Soups','Noodles','Ramen'].includes(name)) return `<em>${name}</em>`;
  return name;
}

document.addEventListener('DOMContentLoaded', init);
