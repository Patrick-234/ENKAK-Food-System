// account.js — profile summary, active order shortcut, order history, logout
import { getUser, getOrdersByCustomer, logout } from './store.js';

const STATUS_LABELS = { confirmed: 'Confirmed', preparing: 'Preparing', out_for_delivery: 'Out for Delivery', delivered: 'Delivered' };
const STATUS_BADGE = {
  confirmed: 'bg-[#FDF1DC] text-[#9A6A1E]',
  preparing: 'bg-[#FDF1DC] text-[#9A6A1E]',
  out_for_delivery: 'bg-[#E6F0F7] text-[#2B5B8C]',
  delivered: 'bg-[#E6F2E9] text-[#2F6B4F]',
};

function naira(n) { return `₦${n.toLocaleString()}`; }

function render() {
  const user = getUser();

  document.getElementById('profile-name').textContent = user.name;
  document.getElementById('profile-email').textContent = user.email || 'No email on file';
  document.getElementById('profile-role').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  document.getElementById('avatar-initial').textContent = (user.name || '?').charAt(0).toUpperCase();

  const orders = getOrdersByCustomer(user.email);
  const list = document.getElementById('orders-list');
  const emptyMsg = document.getElementById('orders-empty');
  list.innerHTML = '';

  if (orders.length === 0) {
    emptyMsg.classList.remove('hidden');
  } else {
    emptyMsg.classList.add('hidden');
    orders.forEach((order) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="/track-order.html?order=${order.id}" class="no-underline block bg-white border border-[#D8C9B4] rounded-2xl p-4 transition-opacity duration-150 hover:opacity-90">
          <div class="flex justify-between items-center flex-wrap gap-2">
            <span class="font-sans text-sm font-semibold">Order #${order.id}</span>
            <span class="font-sans text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[order.status] || ''}">${STATUS_LABELS[order.status] || order.status}</span>
          </div>
          <p class="font-sans text-xs text-[#8A7D6E] mt-1">${order.items.length} item${order.items.length === 1 ? '' : 's'} · ${naira(order.total)}</p>
        </a>
      `;
      list.appendChild(li);
    });
  }

  // Active order shortcut: most recent order that isn't delivered yet
  const active = orders.find((o) => o.status !== 'delivered');
  const activeSection = document.getElementById('active-order-section');
  if (active) {
    activeSection.classList.remove('hidden');
    document.getElementById('active-order-label').textContent = `Order #${active.id}`;
    const statusEl = document.getElementById('active-order-status');
    statusEl.textContent = STATUS_LABELS[active.status] || active.status;
    statusEl.className = `font-sans text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_BADGE[active.status] || ''}`;
    document.getElementById('active-order-link').href = `/track-order.html?order=${active.id}`;
  }
}

document.getElementById('logout-btn').addEventListener('click', () => {
  logout();
  window.location.href = '/';
});

render();