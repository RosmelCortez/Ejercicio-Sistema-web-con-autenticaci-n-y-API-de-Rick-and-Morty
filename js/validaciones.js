export const Validations = {
  isNotEmpty: (value) => value.trim().length > 0,

  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  },

  isSecurePassword: (password) => {
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-#])[A-Za-z\d@$!%*?&._\-#]{8,}$/;
    return passRegex.test(password);
  },

  doPasswordsMatch: (pass, confirmPass) => pass === confirmPass
};

export const showError = (inputEl, errorEl, message) => {
  if (message) {
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    inputEl.classList.add('border-red-500');
  } else {
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
    inputEl.classList.remove('border-red-500');
  }
};
