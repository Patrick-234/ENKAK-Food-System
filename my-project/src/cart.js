// cart.js — renders the cart from the store, wires +/-/remove, totals, checkout nav
import { getCart, updateCartQty, removeFromCart, cartSubtotal, clearCart, cartCount } from './store.js';

const DELIVERY_FEE = 500;
const THUMBS_PATH = './Thumbnails/';

const itemsBox = document.getElementById('cart-items');
const emptyMsg = document.getElementById('cart-empty');
const subtotalEl = document.getElementById('cart-subtotal');
const deliveryEl = document.getElementById('cart-delivery');
const totalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const cartBadge = document.getElementById('cart-badge');

function naira(n) {
  return `₦${n.toLocaleString()}`;
}

function render() {
  const cart = getCart();
  itemsBox.innerHTML = '';

  if (cart.length === 0) {
    emptyMsg.classList.remove('hidden');
  } else {
    emptyMsg.classList.add('hidden');
  }

  cart.forEach((line) => {
    const article = document.createElement('article');
    article.className = 'flex items-center gap-3 sm:gap-4 bg-white border border-[#D8C9B4] rounded-2xl p-3.5';
    article.dataset.itemId = line.id;
    const thumbUrl = line.image ? `${THUMBS_PATH}${line.image}` : '';
    article.innerHTML = `
      <div class="w-16 h-16 rounded-lg bg-cover bg-center bg-no-repeat flex-shrink-0" style="background-image:url('${thumbUrl}')"></div>
      <div class="flex-1 min-w-0">
        <h3 class="text-[15px] font-bold truncate">${line.name}</h3>
        <p class="font-sans text-xs text-[#8A7D6E] mt-0.5">${naira(line.price)} each</p>
        <button type="button" class="remove-btn font-sans text-[11px] text-[#2B2320] bg-none border-none p-0 mt-1.5 cursor-pointer transition-opacity duration-150 hover:opacity-60">Remove</button>
      </div>
      <div class="font-sans flex items-center gap-2.5">
        <button type="button" class="qty-minus inline-flex items-center justify-center w-[26px] h-[26px] rounded-full border border-[#D8C9B4] bg-[#F3EDE2] text-sm leading-none cursor-pointer transition-all duration-150 hover:opacity-80 hover:bg-[#E9DFC9]" aria-label="Decrease quantity">–</button>
        <span class="text-sm min-w-[14px] text-center">${line.qty}</span>
        <button type="button" class="qty-plus inline-flex items-center justify-center w-[26px] h-[26px] rounded-full border border-[#D8C9B4] bg-[#F3EDE2] text-sm leading-none cursor-pointer transition-all duration-150 hover:opacity-80 hover:bg-[#E9DFC9]" aria-label="Increase quantity">+</button>
      </div>
      <div class="font-bold text-[15px] min-w-[60px] sm:min-w-[70px] text-right">${naira(line.qty * line.price)}</div>
    `;
    itemsBox.appendChild(article);
  });

  const subtotal = cartSubtotal();
  subtotalEl.textContent = naira(subtotal);
  deliveryEl.textContent = cart.length ? naira(DELIVERY_FEE) : naira(0);
  totalEl.textContent = naira(cart.length ? subtotal + DELIVERY_FEE : 0);
  checkoutBtn.disabled = cart.length === 0;
  checkoutBtn.classList.toggle('opacity-50', cart.length === 0);
  checkoutBtn.classList.toggle('cursor-not-allowed', cart.length === 0);

  if (cartBadge) cartBadge.textContent = String(cartCount());
}

// Event delegation: one listener handles every item's buttons, including new ones after re-render
itemsBox.addEventListener('click', (e) => {
  const article = e.target.closest('[data-item-id]');
  if (!article) return;
  const itemId = article.dataset.itemId;
  const cart = getCart();
  const line = cart.find((c) => c.id === itemId);
  if (!line) return;

  if (e.target.closest('.qty-plus')) {
    updateCartQty(itemId, line.qty + 1);
  } else if (e.target.closest('.qty-minus')) {
    updateCartQty(itemId, line.qty - 1);
  } else if (e.target.closest('.remove-btn')) {
    removeFromCart(itemId);
  } else {
    return;
  }
  render();
});

const clearCartBtn = document.getElementById('clear-cart-btn');
clearCartBtn?.addEventListener('click', () => {
  if (getCart().length === 0) return;
  clearCart();
  render();
});

checkoutBtn.addEventListener('click', () => {
  if (getCart().length === 0) return;
  window.location.href = '/checkout.html';
});

render();