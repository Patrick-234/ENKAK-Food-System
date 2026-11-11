// admin.js — one page, full control: real orders (status, rider, payment)
// AND real menu management (add/edit/delete/availability), plus logout.
import {
  getOrders, getRiderAccounts, confirmPayment, updateOrderStatus, assignRider, STAGES,
  getMenu, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability,
  logout,
} from './store.js';

const STAGE_LABELS = { confirmed: 'Confirmed', preparing: 'Preparing', out_for_delivery: 'Out for Delivery', delivered: 'Delivered' };
const CATEGORY_COLORS = { Food: '#E9B78C', Drinks: '#C9565A', Snacks: '#CBA36A' };

function naira(n) { return `₦${n.toLocaleString()}`; }

/* ---------------- Orders ---------------- */
const ordersList = document.getElementById('orders-list');
const ordersEmpty = document.getElementById('orders-empty');

function renderOrders() {
  const orders = getOrders();
  const riders = getRiderAccounts();
  ordersList.innerHTML = '';

  if (orders.length === 0) {
    ordersEmpty.classList.remove('hidden');
    return;
  }
  ordersEmpty.classList.add('hidden');

  orders.forEach((order) => {
    const li = document.createElement('li');
    li.className = 'bg-white border border-[#D8C9B4] rounded-2xl p-4 sm:p-4.5 flex flex-col gap-3';
    li.dataset.orderId = order.id;

    const paid = order.paymentStatus === 'paid';
    const riderOptions = riders.length
      ? riders.map((r) => `<option value="${r.email}" ${order.riderId === r.email ? 'selected' : ''}>${r.name}</option>`).join('')
      : '<option value="">No riders registered yet</option>';

    li.innerHTML = `
      <div class="flex justify-between items-start flex-wrap gap-2">
        <div>
          <h3 class="font-bold text-[15px]">Order #${order.id} · ${order.recipient}</h3>
          <p class="font-sans text-xs text-[#8A7D6E] mt-0.5">${order.items.length} item${order.items.length === 1 ? '' : 's'} · ${naira(order.total)}</p>
        </div>
        <span class="font-sans text-[11px] font-semibold px-2.5 py-1 rounded-full ${paid ? 'bg-[#E6F2E9] text-[#2F6B4F]' : 'bg-[#FBEAE6] text-[#A33B2B]'}">${paid ? 'Paid' : 'Payment Pending'}</span>
      </div>
      <div class="font-sans flex gap-3.5 flex-wrap items-end">
        <label class="flex flex-col gap-1 text-[11px] text-[#8A7D6E]">Order status
          <select class="status-select text-[13px] px-2.5 py-1.5 rounded-lg border border-[#D8C9B4] bg-white">
            ${STAGES.map((s) => `<option value="${s}" ${order.status === s ? 'selected' : ''}>${STAGE_LABELS[s]}</option>`).join('')}
          </select>
        </label>
        <label class="flex flex-col gap-1 text-[11px] text-[#8A7D6E]">Assign rider
          <select class="rider-select text-[13px] px-2.5 py-1.5 rounded-lg border border-[#D8C9B4] bg-white">
            <option value="">Unassigned</option>
            ${riderOptions}
          </select>
        </label>
        ${!paid ? '<button type="button" class="confirm-payment-btn bg-[#B4502A] text-[#F3EDE2] border-none px-4 py-2 rounded-lg text-[13px] font-semibold cursor-pointer transition-opacity duration-150 hover:opacity-85">Confirm Payment</button>' : ''}
      </div>
    `;
    ordersList.appendChild(li);
  });
}

ordersList.addEventListener('change', (e) => {
  const li = e.target.closest('[data-order-id]');
  if (!li) return;
  if (e.target.classList.contains('status-select')) {
    updateOrderStatus(li.dataset.orderId, e.target.value);
  } else if (e.target.classList.contains('rider-select')) {
    assignRider(li.dataset.orderId, e.target.value || null);
  }
});

ordersList.addEventListener('click', (e) => {
  const li = e.target.closest('[data-order-id]');
  if (!li) return;
  if (e.target.closest('.confirm-payment-btn')) {
    confirmPayment(li.dataset.orderId);
    renderOrders();
  }
});

/* ---------------- Menu management ---------------- */
const menuList = document.getElementById('menu-items-list');
const addItemForm = document.getElementById('add-item-form');

function renderMenu() {
  const items = getMenu();
  menuList.innerHTML = '';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'bg-white border border-[#D8C9B4] rounded-2xl px-4 py-3 flex items-center gap-3.5 flex-wrap';
    li.dataset.itemId = item.id;
    li.innerHTML = `
      <div class="w-11 h-11 rounded-lg flex-shrink-0" style="background:${CATEGORY_COLORS[item.category] || '#D8C9B4'}"></div>
      <div class="flex-1 min-w-[140px]">
        <p class="font-bold text-sm">${item.name}</p>
        <p class="font-sans text-xs text-[#8A7D6E]">${item.category} · ${naira(item.price)}</p>
      </div>
      <label class="font-sans flex items-center gap-2 text-xs text-[#8A7D6E] cursor-pointer">
        <span>${item.available ? 'Available' : 'Unavailable'}</span>
        <input type="checkbox" ${item.available ? 'checked' : ''} class="availability-toggle sr-only peer" aria-label="Toggle availability for ${item.name}">
        <span class="relative w-10 h-[22px] rounded-full transition-colors duration-150 after:content-[''] after:absolute after:top-0.5 ${item.available ? 'after:left-5 bg-[#B4502A]' : 'after:left-0.5 bg-[#D8C9B4]'} after:w-[18px] after:h-[18px] after:rounded-full after:bg-white after:transition-all"></span>
      </label>
      <button type="button" class="edit-btn bg-[#F3EDE2] text-[#2B2320] border border-[#D8C9B4] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:opacity-80 hover:bg-[#E9DFC9] cursor-pointer">Edit</button>
      <button type="button" class="delete-btn bg-white text-[#A33B2B] border border-[#E3BDB4] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:opacity-80 hover:bg-[#FBEAE6] cursor-pointer">Delete</button>
    `;
    menuList.appendChild(li);
  });
}

menuList.addEventListener('click', (e) => {
  const li = e.target.closest('[data-item-id]');
  if (!li) return;
  const itemId = li.dataset.itemId;
  const item = getMenu().find((i) => i.id === itemId);

  if (e.target.closest('.delete-btn')) {
    if (confirm(`Delete "${item.name}" from the menu?`)) {
      deleteMenuItem(itemId);
      renderMenu();
    }
  } else if (e.target.closest('.edit-btn')) {
    const newName = prompt('Item name:', item.name);
    if (newName === null) return;
    const newPrice = prompt('Price (₦):', item.price);
    if (newPrice === null) return;
    const price = Number(newPrice);
    if (!newName.trim() || Number.isNaN(price) || price <= 0) {
      alert('Please enter a valid name and a positive price.');
      return;
    }
    updateMenuItem(itemId, { name: newName.trim(), price });
    renderMenu();
  }
});

menuList.addEventListener('change', (e) => {
  if (!e.target.classList.contains('availability-toggle')) return;
  const li = e.target.closest('[data-item-id]');
  toggleAvailability(li.dataset.itemId);
  renderMenu();
});

addItemForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('item-name').value.trim();
  const category = document.getElementById('item-category').value;
  const price = Number(document.getElementById('item-price').value);

  if (!name || Number.isNaN(price) || price <= 0) {
    alert('Please enter a valid name and a positive price.');
    return;
  }

  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  addMenuItem({ id, name, category, price, available: true });
  addItemForm.reset();
  renderMenu();
});

/* ---------------- Logout ---------------- */
document.getElementById('admin-logout-btn').addEventListener('click', () => {
  logout();
  window.location.href = '/';
});

renderOrders();
renderMenu();