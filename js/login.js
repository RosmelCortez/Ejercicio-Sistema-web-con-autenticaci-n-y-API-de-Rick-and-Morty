import { checkAuth } from './auth.js';
import { Validations, showError } from './validaciones.js';
import { Storage } from './storage.js';

checkAuth(true);

document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const emailEl = document.getElementById('email');
  const passwordEl = document.getElementById('password');
  const globalError = document.getElementById('global-error');

  const email = emailEl.value;
  const password = passwordEl.value;

  let isValid = true;

  if (!Validations.isNotEmpty(email)) {
    showError(emailEl, document.getElementById('error-email'), 'Campo obligatorio.');
    isValid = false;
  } else { showError(emailEl, document.getElementById('error-email'), ''); }

  if (!Validations.isNotEmpty(password)) {
    showError(passwordEl, document.getElementById('error-password'), 'Campo obligatorio.');
    isValid = false;
  } else { showError(passwordEl, document.getElementById('error-password'), ''); }

  if (isValid) {
    const users = Storage.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      Storage.setSession(user);
      window.location.href = 'index.html';
    } else {
      globalError.textContent = 'Credenciales incorrectas. Verifica tus datos.';
      globalError.classList.remove('hidden');
    }
  }
});
