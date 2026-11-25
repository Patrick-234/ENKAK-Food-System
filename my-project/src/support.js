// support.js — complaint / well-done toggle and form submit for support.html.
// Self-contained on purpose: saves to this browser's localStorage under its own key,
// so it doesn't depend on store.js. (A real backend replaces this later.)

const FEEDBACK_KEY = 'enkak_feedback';

const complaintBtn = document.getElementById('type-complaint');
const commendationBtn = document.getElementById('type-commendation');
const messageLabel = document.getElementById('message-label');
const messageBox = document.getElementById('support-message');
const orderRef = document.getElementById('order-ref');
const submitBtn = document.getElementById('support-submit');
const errorEl = document.getElementById('support-error');
const successEl = document.getElementById('support-success');
const form = document.getElementById('support-form');

const ACTIVE = ['bg-[#B4502A]', 'text-[#F3EDE2]', 'border-[#B4502A]'];
const INACTIVE = ['bg-[#F3EDE2]', 'text-[#2B2320]', 'border-[#D8C9B4]'];

const COPY = {
  complaint: { label: 'Describe the issue', placeholder: 'What went wrong?', submit: 'Submit Complaint' },
  commendation: { label: 'Tell us what you loved', placeholder: 'What made your experience great?', submit: 'Send Well Done' },
};

let type = 'complaint';

function setType(next) {
  type = next;
  const isComplaint = next === 'complaint';

  complaintBtn.classList.remove(...ACTIVE, ...INACTIVE);
  commendationBtn.classList.remove(...ACTIVE, ...INACTIVE);
  complaintBtn.classList.add(...(isComplaint ? ACTIVE : INACTIVE));
  commendationBtn.classList.add(...(isComplaint ? INACTIVE : ACTIVE));
  complaintBtn.setAttribute('aria-pressed', String(isComplaint));
  commendationBtn.setAttribute('aria-pressed', String(!isComplaint));

  messageLabel.textContent = COPY[next].label;
  messageBox.placeholder = COPY[next].placeholder;
  submitBtn.textContent = COPY[next].submit;
  successEl.classList.add('hidden');
}

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('enkak_user')) || {};
  } catch {
    return {};
  }
}

function saveFeedback(entry) {
  let all = [];
  try {
    all = JSON.parse(localStorage.getItem(FEEDBACK_KEY)) || [];
  } catch {
    all = [];
  }
  all.unshift(entry);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(all));
}

complaintBtn.addEventListener('click', () => setType('complaint'));
commendationBtn.addEventListener('click', () => setType('commendation'));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  successEl.classList.add('hidden');

  const message = messageBox.value.trim();
  if (!message) {
    errorEl.classList.remove('hidden');
    return;
  }
  errorEl.classList.add('hidden');

  const user = readUser();
  saveFeedback({
    id: String(Date.now()),
    type,
    orderRef: orderRef.value.trim() || null,
    message,
    fromName: user.name || null,
    fromEmail: user.email || null,
    createdAt: new Date().toISOString(),
  });

  form.reset();
  successEl.classList.remove('hidden');
});

messageBox.addEventListener('input', () => errorEl.classList.add('hidden'));

setType('complaint');