const BASE_URL = 'https://rickandmortyapi.com/api/character';

export const API = {
  getCharacters: async (page = 1) => {
    try {
      const res = await fetch(`${BASE_URL}?page=${page}`);
      if (!res.ok) throw new Error('Error en la API');
      return await res.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getCharacterById: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`);
      if (!res.ok) throw new Error('Personaje no encontrado');
      return await res.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};
