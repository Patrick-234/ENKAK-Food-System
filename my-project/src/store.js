// store.js - tiny localStorage-backed "fake backend" for ENkak
// Swap these functions for real Supabase calls later; keep the same names
// in your pages so the switch-over is a find-and-replace, not a rewrite.

const KEYS = {
  menu: 'enkak_menu',
  cart: 'enkak_cart',
  orders: 'enkak_orders',
  user: 'enkak_user',
  accounts: 'enkak_accounts',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- User (fake login for now) ----
export function getUser() {
  return read(KEYS.user, { name: 'Ada Lovelace', role: 'customer' });
}
export function setUser(user) {
  write(KEYS.user, user);
}

// ---- Accounts (local-only "sign up" record; real auth comes with Supabase) ----
export function getAccounts() {
  return read(KEYS.accounts, []);
}
export function findAccountByEmail(email) {
  return getAccounts().find((a) => a.email.toLowerCase() === email.toLowerCase());
}
export function registerAccount({ name, email, role }) {
  const accounts = getAccounts();
  const existing = findAccountByEmail(email);
  const account = { name, email, role };
  if (existing) {
    Object.assign(existing, account);
  } else {
    accounts.push(account);
  }
  write(KEYS.accounts, accounts);
  setUser(account);
  return account;
}

export const ROLE_REDIRECT = {
  customer: '/menu.html',
  rider: '/rider/dashboard.html',
  admin: '/admin/dashboard.html',
};

// ---- Menu ----
const DEFAULT_MENU = [
  { id: 'fried-rice', name: 'Fried Rice', category: 'Food', price: 2500, available: true, image: 'Fried-rice.jpg' },
  { id: 'roasted-chicken', name: 'Roasted Chicken', category: 'Food', price: 2200, available: true, image: 'Grilled-chicken.jpg' },
  { id: 'jollof-rice', name: 'Jollof Rice', category: 'Food', price: 2000, available: false, image: 'Jollof-rice.jpg' },
  { id: 'egusi-soup', name: 'Egusi Soup', category: 'Food', price: 2000, available: true, image: 'Egusi.jpg' },
  { id: 'afang-soup', name: 'Afang Soup', category: 'Food', price: 2000, available: true, image: 'Afang.jpg' },
  { id: 'chicken-peppersoup', name: 'Chicken Peppersoup', category: 'Food', price: 2500, available: true, image: 'Chicken-pepper-soup.jpg' },
  { id: 'goatmeat-peppersoup', name: 'Goatmeat peppersoup', category: 'Food', price: 2500, available: true, image: 'Goat-meat-peppersoup.jpg' },
  { id: 'grilled-chicken', name: 'Grilled Chicken', category: 'Food', price: 2000, available: true, image: 'grilled-roasted-chicken.jpg' },
  { id: 'amala-and-ewedu', name: 'Amala and Ewedu', category: 'Food', price: 2500, available: true, image: 'Amala and ewedu.jpg' },
  { id: 'plaintain-pottage', name: 'Plaintain Pottage', category: 'Food', price: 1800, available: true, image: 'Porridge plantain.jpg' },
  { id: 'banga', name: 'Banga', category: 'Food', price: 2000, available: true, image: 'Banga.jpg' },
  { id: 'beans', name: 'Beans', category: 'Food', price: 1800, available: true, image: 'Beans.jpg' },
  { id: 'chapman', name: 'Chapman', category: 'Drinks', price: 800, available: true, image: 'Chapman.jpg' },
  { id: 'zobo', name: 'Zobo', category: 'Drinks', price: 600, available: true, image: 'Zobo.jpg' },
  { id: 'bottled-water', name: 'Bottled Water', category: 'Drinks', price: 500, available: true, image: 'Water.jpg' },
  { id: 'pineapple-juice', name: 'Pineapple Juice', category: 'Drinks', price: 1600, available: true, image: 'Piineapple-juice.jpg' },
  { id: 'orange-juice', name: 'Orange Juice', category: 'Drinks', price: 1500, available: true, image: 'Orange.jpg' },
  { id: 'apple-juice', name: 'Apple Juice', category: 'Drinks', price: 1600, available: true, image: 'Apple-juice.jpg' },
  { id: 'tiger-nut', name: 'Tiger Nut', category: 'Drinks', price: 600, available: true, image: 'Tigernut.jpg' },
  { id: 'kunu', name: 'Kunu', category: 'Drinks', price: 600, available: true, image: 'Kunu.jpg' },
  { id: 'meat-pie', name: 'Meat Pie', category: 'Snacks', price: 800, available: true, image: 'Meatpie.jpg' },
  { id: 'doughnut', name: 'Doughnut', category: 'Snacks', price: 600, available: true, image: 'Doughnut.jpg' },
  { id: 'croissant', name: 'Croissant', category: 'Snacks', price: 600, available: true, image: 'Croissant.jpg' },
  { id: 'chocolate-cupcake', name: 'Chocolate Cupcake', category: 'Snacks', price: 3000, available: true, image: 'Chocolate.jpg' },
  { id: 'red-velvet', name: 'Red Velvet', category: 'Snacks', price: 3000, available: true, image: 'Red-velvet.jpg' },
  { id: 'vanilla-cake', name: 'Vanilla cake', category: 'Snacks', price: 3000, available: true, image: 'Vanilla.jpg' },
  { id: 'fish-roll', name: 'Fish Roll', category: 'Snacks', price: 600, available: true, image: 'Fish-roll.jpg' },
  { id: 'shawarma', name: 'Shawarma', category: 'Snacks', price: 3000, available: true, image: 'Shawarma.jpg' },
];

export function getMenu() {
  return read(KEYS.menu, DEFAULT_MENU);
}
export function saveMenu(items) {
  write(KEYS.menu, items);
}
export function toggleAvailability(itemId) {
  const items = getMenu();
  const item = items.find(i => i.id === itemId);
  if (item) item.available = !item.available;
  saveMenu(items);
  return items;
}
export function addMenuItem(item) {
  const items = getMenu();
  items.push({ ...item, id: item.id || crypto.randomUUID() });
  saveMenu(items);
  return items;
}
export function deleteMenuItem(itemId) {
  const items = getMenu().filter(i => i.id !== itemId);
  saveMenu(items);
  return items;
}

// ---- Cart ----
export function getCart() {
  return read(KEYS.cart, []); // [{ id, name, price, qty }]
}
export function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(c => c.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, qty: 1 });
  }
  write(KEYS.cart, cart);
  return cart;
}
export function updateCartQty(itemId, qty) {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter(c => c.id !== itemId);
  } else {
    const line = cart.find(c => c.id === itemId);
    if (line) line.qty = qty;
  }
  write(KEYS.cart, cart);
  return cart;
}
export function removeFromCart(itemId) {
  return updateCartQty(itemId, 0);
}
export function clearCart() {
  write(KEYS.cart, []);
}
export function cartCount() {
  return getCart().reduce((sum, c) => sum + c.qty, 0);
}
export function cartSubtotal() {
  return getCart().reduce((sum, c) => sum + c.qty * c.price, 0);
}

// ---- Orders ----
const DELIVERY_FEE = 500;
const STAGES = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];

export function getOrders() {
  return read(KEYS.orders, []);
}
export function getOrder(orderId) {
  return getOrders().find(o => o.id === orderId);
}
export function createOrder({ recipient, phone, address, notes, paymentMethod }) {
  const items = getCart();
  const subtotal = cartSubtotal();
  const order = {
    id: String(Date.now()).slice(-6),
    items,
    subtotal,
    deliveryFee: DELIVERY_FEE,
    total: subtotal + DELIVERY_FEE,
    recipient, phone, address, notes, paymentMethod,
    paymentStatus: 'paid', // only reached if the fake payment step "succeeds"
    status: 'confirmed',
    riderId: null,
    createdAt: new Date().toISOString(),
  };
  const orders = getOrders();
  orders.unshift(order);
  write(KEYS.orders, orders);
  clearCart();
  return order;
}
export function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) order.status = status;
  write(KEYS.orders, orders);
  return order;
}
export function assignRider(orderId, riderId) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) order.riderId = riderId;
  write(KEYS.orders, orders);
  return order;
}
export function nextStage(currentStage) {
  const idx = STAGES.indexOf(currentStage);
  return STAGES[Math.min(idx + 1, STAGES.length - 1)];
}
export { STAGES };