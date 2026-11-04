// track-order.js — reads ?order=ID from the URL and renders the real stepper
import { getOrder, STAGES } from './store.js';

const params = new URLSearchParams(window.location.search);
const orderId = params.get('order');
const order = orderId ? getOrder(orderId) : null;

const notFound = document.getElementById('order-not-found');
const stepper = document.getElementById('status-stepper');

if (!order) {
  notFound.classList.remove('hidden');
  stepper.classList.add('hidden');
  document.querySelector('[aria-label="Delivery address"]').classList.add('hidden');
} else {
  document.getElementById('order-ref').textContent = `Order #${order.id}`;
  document.getElementById('order-placed-at').textContent =
    `Placed ${new Date(order.createdAt).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}`;
  document.getElementById('delivery-info').innerHTML =
    `${order.recipient} · ${order.phone}<br>${order.address}`;

  const currentIndex = STAGES.indexOf(order.status);

  stepper.querySelectorAll('li[data-step]').forEach((li) => {
    const stepIndex = STAGES.indexOf(li.dataset.step);
    const circle = li.querySelector('.step-circle');
    const line = li.querySelector('.step-line');
    const label = li.querySelector('.step-label');

    if (stepIndex < currentIndex) {
      circle.className = 'step-circle w-[26px] h-[26px] rounded-full flex items-center justify-center text-[13px] font-sans bg-[#F3EDE2] text-[#2B2320] border border-[#B4502A]';
      circle.textContent = '✓';
      if (line) line.className = 'step-line w-0.5 flex-1 min-h-9 bg-[#B4502A]';
      label.classList.remove('text-[#8A7D6E]');
    } else if (stepIndex === currentIndex) {
      circle.className = 'step-circle w-[26px] h-[26px] rounded-full flex items-center justify-center text-[13px] font-sans bg-[#B4502A] text-[#F3EDE2]';
      if (line) line.className = 'step-line w-0.5 flex-1 min-h-9 bg-[#D8C9B4]';
      label.classList.remove('text-[#8A7D6E]');
    } else {
      circle.className = 'step-circle w-[26px] h-[26px] rounded-full flex items-center justify-center text-[13px] font-sans bg-[#F3EDE2] text-[#8A7D6E] border border-[#D8C9B4]';
      if (line) line.className = 'step-line w-0.5 flex-1 min-h-9 bg-[#D8C9B4]';
      label.classList.add('text-[#8A7D6E]');
    }
  });

  if (order.status === 'delivered') {
    const rateBtn = document.getElementById('rate-order-btn');
    rateBtn.classList.remove('hidden');
    rateBtn.addEventListener('click', () => {
      window.location.href = `/review.html?order=${order.id}`;
    });
  }
}