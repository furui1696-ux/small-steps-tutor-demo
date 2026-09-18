const dialog = document.querySelector('#booking-dialog');
const form = document.querySelector('#booking-form');
const content = document.querySelector('#booking-content');
const result = document.querySelector('#booking-result');
const summary = document.querySelector('#request-summary');
let trigger;

function showForm() {
  content.hidden = false;
  result.hidden = true;
  dialog.setAttribute('aria-labelledby', 'booking-title');
  dialog.setAttribute('aria-describedby', 'booking-note');
}

document.querySelectorAll('[data-book]').forEach(button => {
  button.addEventListener('click', () => {
    trigger = button;
    showForm();
    if (button.dataset.focus) form.elements.focus.value = button.dataset.focus;
    dialog.showModal();
    document.body.classList.add('modal-open');
    document.querySelector('#contact-name').focus();
  });
});

function closePreview() { dialog.close(); }
document.querySelector('.close-button').addEventListener('click', closePreview);
document.querySelector('#finish-preview').addEventListener('click', closePreview);
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closePreview();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  form.reset();
  summary.replaceChildren();
  showForm();
  trigger?.focus({ preventScroll: true });
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const name = form.elements.name;
  name.setCustomValidity(name.value.trim() ? '' : 'Please enter an example name.');
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  summary.replaceChildren();
  for (const [label, value] of [['Name', data.get('name').trim()], ['Email', data.get('email')], ['Focus', data.get('focus')], ['Day', data.get('day')]]) {
    const term = document.createElement('dt');
    const detail = document.createElement('dd');
    term.textContent = label;
    detail.textContent = value;
    summary.append(term, detail);
  }
  content.hidden = true;
  result.hidden = false;
  result.querySelector('h2').id = 'result-title';
  result.querySelector('p:not(.eyebrow)').id = 'result-description';
  dialog.setAttribute('aria-labelledby', 'result-title');
  dialog.setAttribute('aria-describedby', 'result-description');
  dialog.scrollTop = 0;
  result.focus();
});
form.elements.name.addEventListener('input', () => form.elements.name.setCustomValidity(''));
document.querySelector('#edit-request').addEventListener('click', () => {
  showForm();
  document.querySelector('#contact-name').focus();
});
