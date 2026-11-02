// checkout.js — renders cart summary, fake payment step, creates the order
import { getCart, cartSubtotal, createOrder } from './store.js';

const DELIVERY_FEE = 500;

const itemsBox = document.getElementById('order-items');
const subtotalEl = document.getElementById('checkout-subtotal');
const deliveryEl = document.getElementById('checkout-delivery');
const totalEl = document.getElementById('checkout-total');
const errorBox = document.getElementById('checkout-error');
const placeOrderBtn = document.getElementById('place-order');
const successModal = document.getElementById('order-success-modal');
const viewOrderBtn = document.getElementById('view-order-btn');
const dismissOrderBtn = document.getElementById('dismiss-order-btn');

const recipientInput = document.getElementById('recipient');
const phoneInput = document.getElementById('phone');
const addressInput = document.getElementById('address');

// Strip any character not allowed for that field, as the user types,
// and show that field's own error message while it's happening.
function restrictInput(el, regex, errorId) {
  const errorEl = document.getElementById(errorId);
  let hideTimer;
  el.addEventListener('input', () => {
    const cleaned = el.value.replace(regex, '');
    if (cleaned !== el.value) {
      el.value = cleaned;
      errorEl.classList.remove('hidden');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => errorEl.classList.add('hidden'), 2500);
    }
  });
}
restrictInput(recipientInput, /[^a-zA-Z\s']/g, 'recipient-error'); // letters, spaces, apostrophe only
restrictInput(phoneInput, /[^0-9]/g, 'phone-error');                // digits only
restrictInput(addressInput, /[^a-zA-Z0-9\s,]/g, 'address-error');  // letters, numbers, spaces, comma only

const payButtons = document.querySelectorAll('.pay-method-btn');
let selectedMethod = 'card';

function naira(n) {
  return `₦${n.toLocaleString()}`;
}

function renderSummary() {
  const cart = getCart();
  itemsBox.innerHTML = cart
    .map((line) => `<div class="flex justify-between"><span>${line.name} ×${line.qty}</span><span>${naira(line.qty * line.price)}</span></div>`)
    .join('');

  const subtotal = cartSubtotal();
  subtotalEl.textContent = naira(subtotal);
  deliveryEl.textContent = naira(cart.length ? DELIVERY_FEE : 0);
  totalEl.textContent = naira(cart.length ? subtotal + DELIVERY_FEE : 0);
}

// Payment method selection
payButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    selectedMethod = btn.dataset.method;
    payButtons.forEach((b) => {
      const active = b === btn;
      b.setAttribute('aria-checked', String(active));
      b.classList.toggle('border-2', active);
      b.classList.toggle('border-[#B4502A]', active);
      b.classList.toggle('bg-[#F3EDE2]', active);
      b.classList.toggle('border', !active);
      b.classList.toggle('border-[#D8C9B4]', !active);
      b.classList.toggle('bg-white', !active);
    });
  });
});

// Fake payment step — swap this function's body for a real Paystack verify call later
function runFakePayment() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 900);
  });
}

placeOrderBtn.addEventListener('click', async () => {
  errorBox.classList.add('hidden');

  const recipient = document.getElementById('recipient').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const notes = document.getElementById('notes').value.trim();

  if (getCart().length === 0) {
    errorBox.textContent = 'Your cart is empty.';
    errorBox.classList.remove('hidden');
    return;
  }
  if (!recipient || !phone || !address) {
    errorBox.textContent = 'Please fill in recipient name, phone number, and delivery address.';
    errorBox.classList.remove('hidden');
    return;
  }

  placeOrderBtn.disabled = true;
  placeOrderBtn.textContent = 'Processing payment…';

  const payment = await runFakePayment();

  if (!payment.success) {
    // Order is NOT created and the success popup never shows — matches the
    // "popup only if payment succeeded" rule.
    errorBox.textContent = 'Payment failed. Please try again.';
    errorBox.classList.remove('hidden');
    placeOrderBtn.disabled = false;
    placeOrderBtn.textContent = 'Place Order';
    return;
  }

  const order = createOrder({ recipient, phone, address, notes, paymentMethod: selectedMethod });

  placeOrderBtn.disabled = false;
  placeOrderBtn.textContent = 'Place Order';
  successModal.classList.remove('hidden');
  successModal.classList.add('flex');

  viewOrderBtn.onclick = () => {
    window.location.href = `/track-order.html?order=${order.id}`;
  };
});

dismissOrderBtn.addEventListener('click', () => {
  successModal.classList.add('hidden');
  successModal.classList.remove('flex');
});

renderSummary();