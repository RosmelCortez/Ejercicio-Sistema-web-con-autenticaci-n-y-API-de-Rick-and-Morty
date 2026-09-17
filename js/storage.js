// Elegimos sessionStorage (y no cookies) para la sesión del usuario logueado:
// la sesión debe terminar en cuanto se cierra la pestaña/navegador, y
// sessionStorage hace eso de forma nativa, sin tener que fijar y controlar
// manualmente una fecha de expiración como tocaría hacer con una cookie.
// Los usuarios registrados y los favoritos, en cambio, sí deben sobrevivir
// al cierre del navegador, por eso van en localStorage.
export const Storage = {
  getUsers: () => JSON.parse(localStorage.getItem('users')) || [],
  
  saveUser: (user) => {
    const users = Storage.getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  },

  updateUser: (oldEmail, updatedUser) => {
    let users = Storage.getUsers();
    users = users.map(u => u.email === oldEmail ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(users));

    if (oldEmail !== updatedUser.email) {
      const favs = Storage.getFavorites(oldEmail);
      localStorage.setItem(`favorites_${updatedUser.email}`, JSON.stringify(favs));
      localStorage.removeItem(`favorites_${oldEmail}`);
    }
  },

  getSession: () => JSON.parse(sessionStorage.getItem('currentUser')),

  setSession: (user) => {
    const { password, ...userWithoutPassword } = user;
    sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  },

  clearSession: () => {
    sessionStorage.removeItem('currentUser');
  },

  getFavorites: (userEmail) => {
    return JSON.parse(localStorage.getItem(`favorites_${userEmail}`)) || [];
  },

  toggleFavorite: (userEmail, characterId) => {
    let favorites = Storage.getFavorites(userEmail);
    const id = Number(characterId);
    if (favorites.includes(id)) {
      favorites = favorites.filter(favId => favId !== id);
    } else {
      favorites.push(id);
    }
    localStorage.setItem(`favorites_${userEmail}`, JSON.stringify(favorites));
    return favorites;
  }
};
