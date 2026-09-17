import { checkAuth } from './auth.js';
import { Validations, showError } from './validaciones.js';
import { Storage } from './storage.js';

checkAuth(true);

document.getElementById('register-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const nameEl = document.getElementById('name');
  const surnameEl = document.getElementById('surname');
  const emailEl = document.getElementById('email');
  const passwordEl = document.getElementById('password');
  const confirmPasswordEl = document.getElementById('confirm-password');

  const name = nameEl.value;
  const surname = surnameEl.value;
  const email = emailEl.value;
  const password = passwordEl.value;
  const confirmPassword = confirmPasswordEl.value;

  let isValid = true;

  if (!Validations.isNotEmpty(name)) {
    showError(nameEl, document.getElementById('error-name'), 'El nombre no puede estar vacío.');
    isValid = false;
  } else { showError(nameEl, document.getElementById('error-name'), ''); }

  if (!Validations.isNotEmpty(surname)) {
    showError(surnameEl, document.getElementById('error-surname'), 'El apellido no puede estar vacío.');
    isValid = false;
  } else { showError(surnameEl, document.getElementById('error-surname'), ''); }

  const users = Storage.getUsers();
  if (!Validations.isNotEmpty(email)) {
    showError(emailEl, document.getElementById('error-email'), 'El correo es obligatorio.');
    isValid = false;
  } else if (!Validations.isValidEmail(email)) {
    showError(emailEl, document.getElementById('error-email'), 'Formato de correo inválido.');
    isValid = false;
  } else if (users.some(u => u.email === email)) {
    showError(emailEl, document.getElementById('error-email'), 'El correo ya está registrado.');
    isValid = false;
  } else { showError(emailEl, document.getElementById('error-email'), ''); }

  if (!Validations.isSecurePassword(password)) {
    showError(passwordEl, document.getElementById('error-password'), 'Mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 especial.');
    isValid = false;
  } else { showError(passwordEl, document.getElementById('error-password'), ''); }

  if (!Validations.doPasswordsMatch(password, confirmPassword)) {
    showError(confirmPasswordEl, document.getElementById('error-confirm-password'), 'Las contraseñas no coinciden.');
    isValid = false;
  } else { showError(confirmPasswordEl, document.getElementById('error-confirm-password'), ''); }

  if (isValid) {
    Storage.saveUser({ name, surname, email, password });
    window.location.href = 'login.html';
  }
});
