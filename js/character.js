import { checkAuth, logout } from './auth.js';
import { API } from './api.js';
import { Storage } from './storage.js';

const user = checkAuth(false);

document.addEventListener('DOMContentLoaded', async () => {
  if (!user) return; // checkAuth ya está redirigiendo a login.html

  document.getElementById('logout-btn').addEventListener('click', logout);

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const loading = document.getElementById('loading');
  const card = document.getElementById('detail-card');

  if (!id) {
    loading.textContent = 'Personaje no especificado.';
    return;
  }

  try {
    const char = await API.getCharacterById(id);
    const favorites = Storage.getFavorites(user.email);
    
    renderDetail(char, favorites.includes(char.id));
    loading.classList.add('hidden');
    card.classList.remove('hidden');
  } catch (err) {
    loading.textContent = 'Ocurrió un error al cargar la información del personaje.';
  }
});

function renderDetail(char, isFav) {
  const card = document.getElementById('detail-card');

  card.innerHTML = `
    <img src="${char.image}" alt="${char.name}" class="w-full md:w-80 rounded-lg object-cover">
    <div class="flex flex-col justify-between flex-1 space-y-4">
      <div>
        <h2 class="text-3xl font-bold text-white mb-2">${char.name}</h2>
        <div class="space-y-2 text-gray-300 text-sm">
          <p><span class="font-bold text-gray-400">Estado:</span> ${char.status}</p>
          <p><span class="font-bold text-gray-400">Especie:</span> ${char.species}</p>
          <p><span class="font-bold text-gray-400">Género:</span> ${char.gender}</p>
          <p><span class="font-bold text-gray-400">Origen:</span> ${char.origin.name}</p>
          <p><span class="font-bold text-gray-400">Ubicación actual:</span> ${char.location.name}</p>
          <p><span class="font-bold text-gray-400">Episodios:</span> ${char.episode.length}</p>
        </div>
      </div>

      <button id="fav-btn" class="py-2.5 px-4 rounded font-bold transition w-full md:w-auto ${isFav ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'bg-gray-700 text-white hover:bg-gray-600'}">
        ${isFav ? '★ En Favoritos' : '☆ Agregar a Favoritos'}
      </button>
    </div>
  `;

  document.getElementById('fav-btn').addEventListener('click', (e) => {
    const updatedFavs = Storage.toggleFavorite(user.email, char.id);
    const isNowFav = updatedFavs.includes(char.id);

    e.target.textContent = isNowFav ? '★ En Favoritos' : '☆ Agregar a Favoritos';
    e.target.className = `py-2.5 px-4 rounded font-bold transition w-full md:w-auto ${isNowFav ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'bg-gray-700 text-white hover:bg-gray-600'}`;
  });
}
