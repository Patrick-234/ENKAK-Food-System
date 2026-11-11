// admin-menu.js — renders real menu items, wires Add/Edit/Delete and the
// availability toggle to the store, so prices and items actually change.
import { getMenu, addMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } from './store.js';

const list = document.getElementById('menu-items-list');
const addForm = document.querySelector('[aria-label="Add new item"] form');
const CATEGORY_COLORS = { Food: '#E9B78C', Drinks: '#C9565A', Snacks: '#CBA36A' };

function naira(n) { return `₦${n.toLocaleString()}`; }

function render() {
  const items = getMenu();
  list.innerHTML = '';

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
    list.appendChild(li);
  });
}

list.addEventListener('click', (e) => {
  const li = e.target.closest('[data-item-id]');
  if (!li) return;
  const itemId = li.dataset.itemId;
  const item = getMenu().find((i) => i.id === itemId);

  if (e.target.closest('.delete-btn')) {
    if (confirm(`Delete "${item.name}" from the menu?`)) {
      deleteMenuItem(itemId);
      render();
    }
  } else if (e.target.closest('.edit-btn')) {
    const newName = prompt('Item name:', item.name);
    if (newName === null) return; // cancelled
    const newPrice = prompt('Price (₦):', item.price);
    if (newPrice === null) return;
    const price = Number(newPrice);
    if (!newName.trim() || Number.isNaN(price) || price <= 0) {
      alert('Please enter a valid name and a positive price.');
      return;
    }
    updateMenuItem(itemId, { name: newName.trim(), price });
    render();
  }
});

list.addEventListener('change', (e) => {
  if (!e.target.classList.contains('availability-toggle')) return;
  const li = e.target.closest('[data-item-id]');
  toggleAvailability(li.dataset.itemId);
  render();
});

addForm.addEventListener('submit', (e) => {
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
  addForm.reset();
  render();
});

render();