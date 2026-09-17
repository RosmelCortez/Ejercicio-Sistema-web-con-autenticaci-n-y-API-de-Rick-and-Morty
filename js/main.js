import { checkAuth, logout } from './auth.js';
import { API } from './api.js';
import { Storage } from './storage.js';

const user = checkAuth(false);

document.addEventListener('DOMContentLoaded', async () => {
  if (!user) return; // checkAuth ya está redirigiendo a login.html

  document.getElementById('user-display').textContent = `Hola, ${user.name}`;
  document.getElementById('logout-btn').addEventListener('click', logout);

  const grid = document.getElementById('character-grid');
  const loading = document.getElementById('loading');

  try {
    const data = await API.getCharacters(1);
    const favorites = Storage.getFavorites(user.email);

    renderCharacters(data.results, favorites);
    loading.classList.add('hidden');
    grid.classList.remove('hidden');
  } catch (err) {
    loading.textContent = 'Hubo un error al consultar la API.';
  }
});

function renderCharacters(characters, favorites) {
  const grid = document.getElementById('character-grid');
  grid.innerHTML = '';

  characters.forEach(char => {
    const isFav = favorites.includes(char.id);
    const card = document.createElement('div');
    card.className = 'bg-gray-800 rounded-lg overflow-hidden border border-gray-700 flex flex-col justify-between shadow-md';

    card.innerHTML = `
      <div class="cursor-pointer" onclick="window.location.href='character.html?id=${char.id}'">
        <img src="${char.image}" alt="${char.name}" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="text-lg font-bold hover:text-green-400 transition">${char.name}</h3>
          <p class="text-sm text-gray-400">Especie: ${char.species}</p>
          <span class="inline-block mt-2 text-xs px-2 py-1 rounded ${char.status === 'Alive' ? 'bg-green-900/60 text-green-300' : 'bg-red-900/60 text-red-300'}">
            ${char.status}
          </span>
        </div>
      </div>
      <div class="p-4 pt-0">
        <button data-id="${char.id}" class="fav-btn w-full py-2 px-4 rounded text-sm font-semibold transition ${isFav ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'bg-gray-700 text-white hover:bg-gray-600'}">
          ${isFav ? '★ En Favoritos' : '☆ Agregar a Favoritos'}
        </button>
      </div>
    `;

    grid.appendChild(card);
  });

  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const charId = e.target.getAttribute('data-id');
      const updatedFavs = Storage.toggleFavorite(user.email, charId);
      const isNowFav = updatedFavs.includes(Number(charId));
      
      e.target.textContent = isNowFav ? '★ En Favoritos' : '☆ Agregar a Favoritos';
      e.target.className = `fav-btn w-full py-2 px-4 rounded text-sm font-semibold transition ${isNowFav ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'bg-gray-700 text-white hover:bg-gray-600'}`;
    });
  });
}
