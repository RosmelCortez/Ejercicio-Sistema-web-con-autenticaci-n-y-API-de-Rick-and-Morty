import { Storage } from './storage.js';

/**
 * Protege una página según si requiere sesión o no.
 * `window.location.href` es asíncrono: el script sigue corriendo un
 * instante después de pedir la redirección. Por eso, en páginas privadas
 * sin sesión, devolvemos null explícitamente: cada página debe cortar su
 * propia ejecución con `if (!user) return;` apenas reciba null, para no
 * intentar leer datos de un usuario que no existe mientras la redirección
 * termina de aplicarse.
 */
export const checkAuth = (isAuthPage = false) => {
  const session = Storage.getSession();

  if (isAuthPage && session) {
    window.location.href = 'index.html';
    return null;
  }
  if (!isAuthPage && !session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
};

export const logout = () => {
  Storage.clearSession();
  window.location.href = 'login.html';
};
