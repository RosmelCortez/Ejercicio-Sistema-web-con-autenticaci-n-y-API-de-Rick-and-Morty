import { checkAuth, logout } from './auth.js';
import { Validations, showError } from './validaciones.js';
import { Storage } from './storage.js';

const user = checkAuth(false);

document.addEventListener('DOMContentLoaded', () => {
  if (!user) return; // checkAuth ya está redirigiendo a login.html

  document.getElementById('logout-btn').addEventListener('click', logout);

  const nameEl = document.getElementById('name');
  const surnameEl = document.getElementById('surname');
  const emailEl = document.getElementById('email');

  nameEl.value = user.name;
  surnameEl.value = user.surname;
  emailEl.value = user.email;
});

document.getElementById('account-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!user) return; // no debería poder llegar aquí sin sesión

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
    showError(nameEl, document.getElementById('error-name'), 'Campo obligatorio.');
    isValid = false;
  } else showError(nameEl, document.getElementById('error-name'), '');

  if (!Validations.isNotEmpty(surname)) {
    showError(surnameEl, document.getElementById('error-surname'), 'Campo obligatorio.');
    isValid = false;
  } else showError(surnameEl, document.getElementById('error-surname'), '');

  const users = Storage.getUsers();
  if (!Validations.isNotEmpty(email)) {
    showError(emailEl, document.getElementById('error-email'), 'Campo obligatorio.');
    isValid = false;
  } else if (!Validations.isValidEmail(email)) {
    showError(emailEl, document.getElementById('error-email'), 'Correo no válido.');
    isValid = false;
  } else if (email !== user.email && users.some(u => u.email === email)) {
    showError(emailEl, document.getElementById('error-email'), 'El correo ya está en uso.');
    isValid = false;
  } else showError(emailEl, document.getElementById('error-email'), '');

  // La contraseña es opcional al editar la cuenta: solo se valida si el
  // usuario escribió algo en alguno de los dos campos.
  if (password || confirmPassword) {
    if (!Validations.isSecurePassword(password)) {
      showError(passwordEl, document.getElementById('error-password'), 'Mín. 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 especial.');
      isValid = false;
    } else showError(passwordEl, document.getElementById('error-password'), '');

    if (!Validations.doPasswordsMatch(password, confirmPassword)) {
      showError(confirmPasswordEl, document.getElementById('error-confirm-password'), 'Las contraseñas no coinciden.');
      isValid = false;
    } else showError(confirmPasswordEl, document.getElementById('error-confirm-password'), '');
  } else {
    showError(passwordEl, document.getElementById('error-password'), '');
    showError(confirmPasswordEl, document.getElementById('error-confirm-password'), '');
  }

  if (isValid) {
    // `user` viene de la sesión y no trae password (setSession lo omite a
    // propósito). Si el campo de contraseña se dejó en blanco, buscamos la
    // contraseña real del usuario en los registros completos para no perderla.
    const originalUser = users.find(u => u.email === user.email);
    const finalPassword = password || originalUser.password;

    const updatedUser = { name, surname, email, password: finalPassword };
    Storage.updateUser(user.email, updatedUser);
    Storage.setSession(updatedUser);

    const msg = document.getElementById('success-msg');
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 3000);
  }
});
