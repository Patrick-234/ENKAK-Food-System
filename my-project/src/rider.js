// rider.js — shows the logged-in rider's assigned orders (item count only,
// never names, per the no-package-contents rule) and lets them advance status.
import { getOrders, getUser, updateOrderStatus } from './store.js';

const list = document.getElementById('orders-list');
const emptyMsg = document.getElementById('orders-empty');
const greeting = document.getElementById('rider-greeting');

const STAGE_META = {
  confirmed:        { label: 'Not Ready Yet',    badge: 'bg-[#EFE7DB] text-[#8A7D6E]' },
  preparing:        { label: 'Awaiting Pickup',  badge: 'bg-[#FBEAE6] text-[#A33B2B]', action: 'Mark Picked Up', next: 'out_for_delivery' },
  out_for_delivery: { label: 'Out for Delivery', badge: 'bg-[#E6F0F7] text-[#2B5B8C]', action: 'Mark Delivered', next: 'delivered' },
  delivered:        { label: 'Delivered',        badge: 'bg-[#E6F2E9] text-[#2F6B4F]' },
};

function render() {
  const user = getUser();
  if (greeting) greeting.textContent = `Hello, ${user.name} — here are your deliveries`;

  const myOrders = getOrders().filter((o) => o.riderId === user.email);
  list.innerHTML = '';

  if (myOrders.length === 0) {
    emptyMsg.classList.remove('hidden');
    return;
  }
  emptyMsg.classList.add('hidden');

  myOrders.forEach((order) => {
    const meta = STAGE_META[order.status] || STAGE_META.confirmed;
    const li = document.createElement('article');
    li.className = 'bg-white border border-[#D8C9B4] rounded-2xl p-4 sm:p-4.5 flex flex-col gap-3';
    li.dataset.orderId = order.id;
    li.innerHTML = `
      <div class="flex justify-between items-start flex-wrap gap-2">
        <h2 class="font-bold text-[15px]">Order #${order.id} · ${order.items.length} item${order.items.length === 1 ? '' : 's'}</h2>
        <span class="font-sans text-[11px] font-semibold px-2.5 py-1 rounded-full ${meta.badge}">${meta.label}</span>
      </div>
      <div class="font-sans text-[13px] text-[#5C5248] leading-relaxed">
        <p><strong>Pick up:</strong> ENkak Kitchen, 4 Market Road, Abuja</p>
        <p><strong>Deliver to:</strong> ${order.recipient}, ${order.address}</p>
      </div>
      ${meta.action ? `<button type="button" class="status-action-btn self-start bg-[#B4502A] text-[#F3EDE2] border-none px-4.5 py-2.5 rounded-lg text-[13px] font-semibold cursor-pointer transition-opacity duration-150 hover:opacity-85">${meta.action}</button>` : ''}
    `;
    list.appendChild(li);
  });
}

list.addEventListener('click', (e) => {
  const btn = e.target.closest('.status-action-btn');
  if (!btn) return;
  const article = e.target.closest('[data-order-id]');
  const order = getOrders().find((o) => o.id === article.dataset.orderId);
  const meta = STAGE_META[order.status];
  if (meta?.next) {
    updateOrderStatus(order.id, meta.next);
    render();
  }
});

render();