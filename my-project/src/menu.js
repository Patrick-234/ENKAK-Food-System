// menu.js — greeting, cart badge, add-to-cart, simple search filter
import { getUser, getMenu, addToCart, cartCount } from './store.js';

const userNameEl = document.getElementById('user-name');
const cartBadge = document.getElementById('cart-badge');
const search = document.getElementById('menu-search');

function refreshGreeting() {
  const user = getUser();
  if (userNameEl) userNameEl.textContent = user.name;
}

function refreshBadge() {
  if (cartBadge) cartBadge.textContent = String(cartCount());
}

// Wire every "Add" button to the matching menu item by data-item-id
document.querySelectorAll('.add-to-cart-btn').forEach((btn) => {
  const article = btn.closest('[data-item-id]');
  if (!article) return;
  const itemId = article.dataset.itemId;

  btn.addEventListener('click', () => {
    const item = getMenu().find((m) => m.id === itemId);
    if (!item || !item.available) return;
    addToCart(item);
    refreshBadge();
  });
});

// Simple search: hide/show cards whose name doesn't match (client-side only)
search?.addEventListener('input', () => {
  const q = search.value.trim().toLowerCase();
  document.querySelectorAll('[data-item-id]').forEach((article) => {
    const name = article.querySelector('h3')?.textContent.toLowerCase() || '';
    article.style.display = q === '' || name.includes(q) ? '' : 'none';
  });
});

refreshGreeting();
refreshBadge();