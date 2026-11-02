// login.js — tab switching, terms accordion, signup validation, fake login
import { registerAccount, findAccountByEmail, ROLE_REDIRECT } from './store.js';

const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchLink = document.getElementById('switch-to-signup');

const ACTIVE = ['bg-[#B4502A]', 'text-[#F3EDE2]', 'border-[#B4502A]'];
const INACTIVE = ['bg-[#F3EDE2]', 'text-[#2B2320]', 'border-[#D8C9B4]'];

function showTab(tab) {
  const isSignup = tab === 'signup';
  loginForm.classList.toggle('hidden', isSignup);
  loginForm.classList.toggle('flex', !isSignup);
  signupForm.classList.toggle('hidden', !isSignup);
  signupForm.classList.toggle('flex', isSignup);

  tabLogin.classList.remove(...ACTIVE, ...INACTIVE);
  tabSignup.classList.remove(...ACTIVE, ...INACTIVE);
  tabLogin.classList.add(...(isSignup ? INACTIVE : ACTIVE));
  tabSignup.classList.add(...(isSignup ? ACTIVE : INACTIVE));
}

// Role selector (Customer / Rider / Admin)
const roleButtons = document.querySelectorAll('#role-customer, #role-rider, #role-admin');
let selectedRole = 'customer';

roleButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    selectedRole = btn.dataset.role;
    roleButtons.forEach((b) => {
      const active = b === btn;
      b.setAttribute('aria-pressed', String(active));
      b.classList.toggle('bg-[#B4502A]', active);
      b.classList.toggle('text-[#F3EDE2]', active);
      b.classList.toggle('border-[#B4502A]', active);
      b.classList.toggle('bg-[#F3EDE2]', !active);
      b.classList.toggle('text-[#2B2320]', !active);
      b.classList.toggle('border-[#D8C9B4]', !active);
    });
  });
});

tabLogin?.addEventListener('click', () => showTab('login'));
tabSignup?.addEventListener('click', () => showTab('signup'));
switchLink?.addEventListener('click', (e) => { e.preventDefault(); showTab('signup'); });

// Terms accordion
const termsToggle = document.getElementById('terms-toggle');
const termsClose = document.getElementById('terms-close');
const termsBox = document.getElementById('terms-box');

termsToggle?.addEventListener('click', () => {
  termsBox.classList.toggle('hidden');
  termsToggle.textContent = termsBox.classList.contains('hidden')
    ? 'Read Terms of Service & Privacy Policy'
    : 'Hide Terms of Service & Privacy Policy';
});
termsClose?.addEventListener('click', () => {
  termsBox.classList.add('hidden');
  termsToggle.textContent = 'Read Terms of Service & Privacy Policy';
});

// Signup validation: checkbox required + passwords must match
signupForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const errorBox = document.getElementById('signup-error');
  const agree = document.getElementById('agree');
  const password = document.getElementById('signup-password');
  const confirm = document.getElementById('signup-confirm');
  const name = document.getElementById('signup-name');

  if (!agree.checked) {
    errorBox.textContent = 'You must agree to the Terms of Service and Privacy Policy to create an account.';
    errorBox.classList.remove('hidden');
    return;
  }
  if (password.value !== confirm.value) {
    errorBox.textContent = 'Password and Confirm Password do not match.';
    errorBox.classList.remove('hidden');
    return;
  }
  errorBox.classList.add('hidden');

  // Create the account locally (real auth comes once Supabase is wired up)
  const emailField = document.getElementById('signup-email');
  registerAccount({ name: name.value || 'Guest', email: emailField.value, role: selectedRole });
  window.location.href = ROLE_REDIRECT[selectedRole];
});

// Login: looks the email up in local accounts to restore their name/role,
// falling back to the role picker above if it's a new email (no backend yet)
loginForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const existing = findAccountByEmail(email);
  const role = existing ? existing.role : selectedRole;
  if (existing) {
    registerAccount(existing); // refresh as current session user
  } else {
    registerAccount({ name: email.split('@')[0] || 'Guest', email, role: selectedRole });
  }
  window.location.href = ROLE_REDIRECT[role];
});